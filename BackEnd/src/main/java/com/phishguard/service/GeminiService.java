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
public class GeminiService {

    @Value("${gemini.api.key:YOUR_API_KEY}")
    private String apiKey;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public GeminiService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        this.webClient = webClientBuilder.baseUrl("https://generativelanguage.googleapis.com").build();
        this.objectMapper = objectMapper;
    }

    public String generateContent(String prompt) {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("YOUR_API_KEY")) {
            return "Error: Gemini API key is not configured. Please add gemini.api.key to application.yml.";
        }

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> partsMap = new HashMap<>();
        partsMap.put("text", prompt);

        Map<String, Object> contentMap = new HashMap<>();
        contentMap.put("parts", List.of(partsMap));

        requestBody.put("contents", List.of(contentMap));

        String[] modelsToTry = {"gemini-2.5-flash", "gemini-2.0-flash"};
        Exception lastException = null;

        for (String model : modelsToTry) {
            try {
                String responseStr = webClient.post()
                        .uri("/v1beta/models/" + model + ":generateContent?key=" + apiKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(requestBody)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();

                JsonNode rootNode = objectMapper.readTree(responseStr);
                JsonNode textNode = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text");
                return textNode.asText();
            } catch (Exception e) {
                lastException = e;
                System.err.println("Model " + model + " failed with error: " + e.getMessage());
                // If it's the last model, we will break out and return the error
            }
        }
        
        return "Error generating content from Gemini API: " + (lastException != null ? lastException.getMessage() : "Unknown error");
    }
}
