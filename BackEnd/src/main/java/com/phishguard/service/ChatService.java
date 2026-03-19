package com.phishguard.service;

import com.phishguard.dto.ChatRequest;
import com.phishguard.dto.ChatResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    @Autowired
    private GeminiService geminiService;

    public ChatResponse processChat(ChatRequest request, String userId) {
        String prompt = "You are a cybersecurity expert assistant for an app called PhishGuard AI. " +
                        "A user is asking: \"" + request.getMessage() + "\"\n" +
                        "Provide a helpful, precise, and concise response focusing on cybersecurity best practices.";
        
        String reply = geminiService.generateContent(prompt);
        return new ChatResponse(reply);
    }
}
