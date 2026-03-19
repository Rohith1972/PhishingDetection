package com.phishguard.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SafeBrowsingService {

    @Value("${safebrowsing.api.key:YOUR_API_KEY}")
    private String apiKey;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public SafeBrowsingService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        this.webClient = webClientBuilder.baseUrl("https://safebrowsing.googleapis.com").build();
        this.objectMapper = objectMapper;
    }

    public boolean isMalicious(String url) {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("YOUR_API_KEY")) {
            System.err.println("Safe Browsing API key not configured.");
            return false;
        }

        try {
            Map<String, Object> requestBody = new HashMap<>();

            Map<String, Object> clientMap = new HashMap<>();
            clientMap.put("clientId", "phishguard");
            clientMap.put("clientVersion", "1.0.0");
            requestBody.put("client", clientMap);

            Map<String, Object> threatInfo = new HashMap<>();
            threatInfo.put("threatTypes", List.of("MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"));
            threatInfo.put("platformTypes", List.of("ANY_PLATFORM"));
            threatInfo.put("threatEntryTypes", List.of("URL"));

            Map<String, String> urlMap = new HashMap<>();
            urlMap.put("url", url);
            threatInfo.put("threatEntries", List.of(urlMap));

            requestBody.put("threatInfo", threatInfo);

            String responseStr = webClient.post()
                    .uri("/v4/threatMatches:find?key=" + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (responseStr != null && !responseStr.trim().isEmpty() && !responseStr.equals("{}")) {
                JsonNode rootNode = objectMapper.readTree(responseStr);
                if (rootNode.has("matches") && rootNode.get("matches").isArray() && rootNode.get("matches").size() > 0) {
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Safe Browsing API check failed: " + e.getMessage());
            return false;
        }
    }
}
