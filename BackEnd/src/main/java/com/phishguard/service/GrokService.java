package com.phishguard.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GrokService {

    @Value("${grok.api.key:YOUR_API_KEY}")
    private String apiKey;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public GrokService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        this.webClient = webClientBuilder.baseUrl("https://api.groq.com/openai/v1").build();
        this.objectMapper = objectMapper;
    }

    public String generateContent(String prompt) {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("YOUR_API_KEY") || apiKey.equals("YOUR_GROK_API_KEY")) {
            return "Error: Grok API key is not configured. Please add grok.api.key to application.yml or set GROK_API_KEY in .env";
        }

        Map<String, Object> messageMap = new HashMap<>();
        messageMap.put("role", "user");
        messageMap.put("content", prompt);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("messages", List.of(messageMap));

        String[] modelsToTry = {"llama-3.3-70b-versatile", "llama-3.1-8b-instant"};
        Exception lastException = null;

        for (String model : modelsToTry) {
            requestBody.put("model", model);
            try {
                String responseStr = webClient.post()
                        .uri("/chat/completions")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(requestBody)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();

                JsonNode rootNode = objectMapper.readTree(responseStr);
                JsonNode textNode = rootNode.path("choices").get(0).path("message").path("content");
                return textNode.asText();
            } catch (Exception e) {
                lastException = e;
                System.err.println("Model " + model + " failed with error: " + e.getMessage());
                // If it's the last model, we will break out and return the error
            }
        }
        
        return "Error generating content from Grok API: " + (lastException != null ? lastException.getMessage() : "Unknown error");
    }
}
