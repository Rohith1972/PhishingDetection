package com.phishguard.controller;

import com.phishguard.dto.ChatRequest;
import com.phishguard.dto.ChatResponse;
import com.phishguard.security.UserPrincipal;
import com.phishguard.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@Valid @RequestBody ChatRequest request, @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(chatService.processChat(request, user.getId()));
    }
}
