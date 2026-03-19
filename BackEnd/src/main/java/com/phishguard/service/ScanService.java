package com.phishguard.service;

import com.phishguard.dto.FileScanResponse;
import com.phishguard.dto.MessageScanRequest;
import com.phishguard.dto.MessageScanResponse;
import com.phishguard.dto.ScanUrlRequest;
import com.phishguard.dto.ScanUrlResponse;
import com.phishguard.entity.RiskLevel;
import com.phishguard.entity.ScanHistory;
import com.phishguard.entity.ScanType;
import com.phishguard.repository.ScanHistoryRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class ScanService {

    @Autowired
    private ScanHistoryRepository scanHistoryRepository;

    @Autowired
    private SafeBrowsingService safeBrowsingService;

    @Autowired
    private GeminiService geminiService;

    @Autowired
    private ObjectMapper objectMapper;

    public ScanUrlResponse scanUrl(ScanUrlRequest request, String userId) {
        boolean isSafeBrowsingMalicious = safeBrowsingService.isMalicious(request.getUrl());
        String prompt;
        
        if (isSafeBrowsingMalicious) {
            prompt = "The URL " + request.getUrl() + " has been flagged as MALICIOUS by Google Safe Browsing. Explain what this could mean and what specific threats it might pose. " +
                     "Respond ONLY with a valid JSON strictly containing these keys: 'riskScore' (80-100 integer), 'status' ('HIGH_RISK'), 'flags' (array of strings, e.g. ['Malware', 'Phishing']), and 'explanation' (string).";
        } else {
            prompt = "Analyze the following URL for phishing characteristics: " + request.getUrl() + ". It is not currently on the Safe Browsing blocklist, but perform a heuristic check. " +
                     "Respond ONLY with a valid JSON strictly containing these keys: 'riskScore' (0-100 integer), 'status' ('SAFE' or 'SUSPICIOUS'), 'flags' (array of strings, e.g. ['Suspicious Keywords']), and 'explanation' (string).";
        }
        
        ScanUrlResponse response;
        try {
            String aiResult = geminiService.generateContent(prompt).replaceAll("```json|```", "").trim();
            JsonNode node = objectMapper.readTree(aiResult);
            List<String> flagsList = new ArrayList<>();
            if (node.has("flags") && node.get("flags").isArray()) {
                node.get("flags").forEach(f -> flagsList.add(f.asText()));
            }
            
            response = ScanUrlResponse.builder()
                    .riskScore(node.has("riskScore") ? node.get("riskScore").asInt() : (isSafeBrowsingMalicious ? 95 : 12))
                    .status(node.has("status") ? node.get("status").asText() : (isSafeBrowsingMalicious ? "HIGH_RISK" : "SAFE"))
                    .flags(flagsList)
                    .explanation(node.has("explanation") ? node.get("explanation").asText() : "Analyzed by AI.")
                    .build();
        } catch (Exception e) {
            response = ScanUrlResponse.builder()
                    .riskScore(isSafeBrowsingMalicious ? 95 : 12)
                    .status(isSafeBrowsingMalicious ? "HIGH_RISK" : "SAFE")
                    .flags(isSafeBrowsingMalicious ? Arrays.asList("Google Safe Browsing Flagged") : List.of())
                    .explanation("Fallback check: " + (isSafeBrowsingMalicious ? "Threat detected by Safe Browsing." : "Safe."))
                    .build();
        }
                
        saveHistory(userId, ScanType.URL, request.getUrl(), "{\"score\":" + response.getRiskScore() + ", \"status\":\"" + response.getStatus() + "\"}", response.getRiskScore());
        return response;
    }

    public MessageScanResponse scanMessage(MessageScanRequest request, String userId) {
        MessageScanResponse response = null;
        
        // 1. Try to call the internal Python script via ProcessBuilder
        try {
            ProcessBuilder pb = new ProcessBuilder("python3", "/app/ml_scripts/spam_classifier.py", "--predict", request.getMessage());
            pb.redirectErrorStream(true);
            Process process = pb.start();
            
            java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.InputStreamReader(process.getInputStream()));
            String line;
            boolean isSpam = false;
            boolean predicted = false;
            
            while ((line = reader.readLine()) != null) {
                if (line.trim().equals("SPAM")) {
                    isSpam = true;
                    predicted = true;
                } else if (line.trim().equals("HAM")) {
                    isSpam = false;
                    predicted = true;
                }
            }
            
            int exitCode = process.waitFor();
            
            if (exitCode == 0 && predicted) {
                // Get AI explanation based on the Python script prediction
                String prompt = "The following message was classified by our internal SVM ML model as " + (isSpam ? "SPAM/PHISHING" : "SAFE") + ".\n" +
                        "Message: " + request.getMessage() + "\n" +
                        "Respond ONLY with a valid JSON strictly containing these keys: 'highlightedText' (array of strings showing keywords from the text that justify this), and 'explanation' (a 1-2 sentence explanation of why it is classified this way).";
                
                List<String> highlights = new ArrayList<>();
                String explanation = "Analyzed by Internal SVM Model.";
                
                try {
                    String aiResult = geminiService.generateContent(prompt).replaceAll("```json|```", "").trim();
                    JsonNode aiNode = objectMapper.readTree(aiResult);
                    if (aiNode.has("highlightedText") && aiNode.get("highlightedText").isArray()) {
                        aiNode.get("highlightedText").forEach(f -> highlights.add(f.asText()));
                    }
                    if (aiNode.has("explanation")) {
                        explanation = aiNode.get("explanation").asText();
                    }
                } catch (Exception e) {}
                
                response = MessageScanResponse.builder()
                        .classification(isSpam ? "PHISHING" : "SAFE")
                        .riskScore(isSpam ? 90 : 10)
                        .highlightedText(highlights)
                        .explanation(explanation + " (Prediction by ML Script).")
                        .build();
            }
        } catch (Exception ex) {
            System.err.println("Message analyzer script error (model might not be trained yet): " + ex.getMessage());
        }
        
        // 2. Fallback to Gemini AI if microservice fails or isn't trained
        if (response == null) {
            String prompt = "Analyze the following message for phishing, smishing, or scam patterns: " + request.getMessage() + "\n" +
                    "Respond ONLY with a valid JSON strictly containing these keys: 'classification' ('SAFE' or 'PHISHING'), 'riskScore' (0-100 integer), 'highlightedText' (array of strings showing suspicious keywords from the text), and 'explanation' (string).";
            
            try {
                String aiResult = geminiService.generateContent(prompt).replaceAll("```json|```", "").trim();
                JsonNode node = objectMapper.readTree(aiResult);
                List<String> highlights = new ArrayList<>();
                if (node.has("highlightedText") && node.get("highlightedText").isArray()) {
                    node.get("highlightedText").forEach(f -> highlights.add(f.asText()));
                }
                
                response = MessageScanResponse.builder()
                        .classification(node.has("classification") ? node.get("classification").asText() : "SAFE")
                        .riskScore(node.has("riskScore") ? node.get("riskScore").asInt() : 15)
                        .highlightedText(highlights)
                        .explanation(node.has("explanation") ? node.get("explanation").asText() : "Analyzed by Gemini AI.")
                        .build();
            } catch (Exception e) {
                String lower = request.getMessage().toLowerCase();
                boolean isPhishing = lower.contains("urgent") || lower.contains("password") || lower.contains("account") || lower.contains("click");
                response = MessageScanResponse.builder()
                        .classification(isPhishing ? "PHISHING" : "SAFE")
                        .riskScore(isPhishing ? 92 : 15)
                        .highlightedText(isPhishing ? Arrays.asList("urgent", "password", "click") : List.of())
                        .explanation("Fallback algorithmic checking.")
                        .build();
            }
        }
                
        saveHistory(userId, ScanType.EMAIL, request.getMessage().substring(0, Math.min(request.getMessage().length(), 100)) + "...", 
            "{\"classification\":\"" + response.getClassification() + "\"}", response.getRiskScore());
            
        return response;
    }

    public FileScanResponse scanFile(MultipartFile file, String userId) {
        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "unknown_file";
        FileScanResponse response = null;

        try {
            byte[] bytes = file.getBytes();
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(bytes);
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) {
                sb.append(String.format("%02x", b));
            }
            String sha256 = sb.toString();

            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("x-apikey", "AwDPALCRcSaqiTVmPNyjGz");
            
            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);
            
            try {
                org.springframework.http.ResponseEntity<String> vtRes = restTemplate.exchange(
                    "https://www.virustotal.com/api/v3/files/" + sha256,
                    org.springframework.http.HttpMethod.GET,
                    entity,
                    String.class
                );
                
                if (vtRes.getStatusCode().is2xxSuccessful()) {
                    JsonNode root = objectMapper.readTree(vtRes.getBody());
                    JsonNode stats = root.path("data").path("attributes").path("last_analysis_stats");
                    int malicious = stats.path("malicious").asInt(0);
                    int suspicious = stats.path("suspicious").asInt(0);
                    
                    boolean isMalicious = malicious > 0 || suspicious > 0;
                    String threatLevel = malicious > 0 ? "HIGH" : (suspicious > 0 ? "MEDIUM" : "LOW");
                    
                    String vtDetails = getAiExplanationForFile(filename, malicious, suspicious, file.getSize());
                    
                    response = FileScanResponse.builder()
                        .malicious(isMalicious)
                        .threatLevel(threatLevel)
                        .details(vtDetails)
                        .build();
                }
            } catch (org.springframework.web.client.HttpClientErrorException.NotFound e) {
                // Not found. Uploading file to VirusTotal.
                org.springframework.http.HttpHeaders uploadHeaders = new org.springframework.http.HttpHeaders();
                uploadHeaders.set("x-apikey", "AwDPALCRcSaqiTVmPNyjGz");
                uploadHeaders.setContentType(org.springframework.http.MediaType.MULTIPART_FORM_DATA);
                
                org.springframework.util.MultiValueMap<String, Object> body = new org.springframework.util.LinkedMultiValueMap<>();
                
                org.springframework.core.io.ByteArrayResource resource = new org.springframework.core.io.ByteArrayResource(bytes) {
                    @Override
                    public String getFilename() {
                        return filename;
                    }
                };
                body.add("file", resource);
                
                org.springframework.http.HttpEntity<org.springframework.util.MultiValueMap<String, Object>> requestEntity = new org.springframework.http.HttpEntity<>(body, uploadHeaders);
                
                org.springframework.http.ResponseEntity<String> uploadRes = restTemplate.postForEntity(
                    "https://www.virustotal.com/api/v3/files",
                    requestEntity,
                    String.class
                );
                
                if (uploadRes.getStatusCode().is2xxSuccessful()) {
                    JsonNode root = objectMapper.readTree(uploadRes.getBody());
                    String analysisId = root.path("data").path("id").asText();
                    
                    for (int i = 0; i < 5; i++) {
                        Thread.sleep(8000); 
                        try {
                            org.springframework.http.ResponseEntity<String> analysisRes = restTemplate.exchange(
                                "https://www.virustotal.com/api/v3/analyses/" + analysisId,
                                org.springframework.http.HttpMethod.GET,
                                entity, 
                                String.class
                            );
                            
                            if (analysisRes.getStatusCode().is2xxSuccessful()) {
                                JsonNode aRoot = objectMapper.readTree(analysisRes.getBody());
                                String status = aRoot.path("data").path("attributes").path("status").asText();
                                
                                if ("completed".equalsIgnoreCase(status)) {
                                    JsonNode stats = aRoot.path("data").path("attributes").path("stats");
                                    int malicious = stats.path("malicious").asInt(0);
                                    int suspicious = stats.path("suspicious").asInt(0);
                                    
                                    boolean isMalicious = malicious > 0 || suspicious > 0;
                                    String threatLevel = malicious > 0 ? "HIGH" : (suspicious > 0 ? "MEDIUM" : "LOW");
                                    
                                    String vtDetails = getAiExplanationForFile(filename, malicious, suspicious, file.getSize());
                                    
                                    response = FileScanResponse.builder()
                                        .malicious(isMalicious)
                                        .threatLevel(threatLevel)
                                        .details(vtDetails)
                                        .build();
                                    break;
                                }
                            }
                        } catch (Exception pollEx) {
                            // Ignore poll error, try again
                        }
                    }
                }
            }
        } catch (Exception ex) {
            // Log or ignore to fallback
            System.err.println("VirusTotal API error: " + ex.getMessage());
        }
        
        if (response == null) {
            // Fallback to AI heuristic behavior if VirusTotal fails or takes too long
            String prompt = "A user just uploaded a file to our cybersecurity app with the filename: " + filename + " and size: " + file.getSize() + " bytes.\n" +
                    "Evaluate if this file extension and typical characteristics correlate with malware delivery.\n" +
                    "Respond ONLY with a valid JSON strictly containing these keys: 'malicious' (boolean), 'threatLevel' ('LOW', 'MEDIUM', 'HIGH'), 'details' (string).";
            
            try {
                String aiResult = geminiService.generateContent(prompt).replaceAll("```json|```", "").trim();
                JsonNode node = objectMapper.readTree(aiResult);
                
                response = FileScanResponse.builder()
                        .malicious(node.has("malicious") && node.get("malicious").asBoolean())
                        .threatLevel(node.has("threatLevel") ? node.get("threatLevel").asText() : "LOW")
                        .details(node.has("details") ? node.get("details").asText() : "Scanned by AI heuristic behavior.")
                        .build();
            } catch (Exception e) {
                boolean malicious = filename.toLowerCase().endsWith(".exe") || filename.toLowerCase().endsWith(".bat") || filename.toLowerCase().endsWith(".vbs");
                response = FileScanResponse.builder()
                        .malicious(malicious)
                        .threatLevel(malicious ? "HIGH" : "LOW")
                        .details(malicious ? "Suspicious extension detected." : "File appears safe.")
                        .build();
            }
        }
                
        saveHistory(userId, ScanType.FILE, filename, "{\"threatLevel\":\"" + response.getThreatLevel() + "\"}", response.isMalicious() ? 95 : 5);
        
        return response;
    }
    
    private void saveHistory(String userId, ScanType type, String input, String resultStr, int score) {
        RiskLevel rLevel = score >= 70 ? RiskLevel.HIGH : (score >= 30 ? RiskLevel.MEDIUM : RiskLevel.LOW);
        
        ScanHistory history = ScanHistory.builder()
                .userId(userId)
                .type(type)
                .input(input)
                .result(resultStr)
                .riskScore(score)
                .riskLevel(rLevel)
                .build();
        scanHistoryRepository.save(history);
    }

    public String trainMessageModel() throws Exception {
        ProcessBuilder pb = new ProcessBuilder("python3", "/app/ml_scripts/spam_classifier.py", "--train");
        pb.redirectErrorStream(true);
        Process process = pb.start();
        
        java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.InputStreamReader(process.getInputStream()));
        StringBuilder output = new StringBuilder();
        String line;
        
        while ((line = reader.readLine()) != null) {
            output.append(line).append("\n");
        }
        
        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new Exception("Training script failed with exit code " + exitCode + ".\nOutput: " + output.toString());
        }
        
        return "Model trained successfully:\n" + output.toString();
    }

    private String getAiExplanationForFile(String filename, int malicious, int suspicious, long filesize) {
        String prompt = "A file named '" + filename + "' (size: " + filesize + " bytes) was scanned by VirusTotal. " +
                "The results show " + malicious + " security vendors flagged it as malicious and " + suspicious + " flagged it as suspicious. " +
                "Provide a brief, professional AI explanation (2-3 sentences max) of what this implies for the user's security. If it's safe (0 malicious/suspicious), explain why it's considered safe but remind them to still be cautious.";
        try {
            return geminiService.generateContent(prompt).replaceAll("```json|```", "").trim();
        } catch (Exception e) {
            if (malicious > 0 || suspicious > 0) {
                return "VirusTotal flagged this file as malicious (" + malicious + " engines) / suspicious (" + suspicious + " engines).";
            }
            return "VirusTotal found no threats for this file.";
        }
    }
}
