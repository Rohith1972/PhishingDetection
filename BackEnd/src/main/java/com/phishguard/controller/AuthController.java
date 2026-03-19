package com.phishguard.controller;

import com.phishguard.dto.JwtAuthenticationResponse;
import com.phishguard.dto.LoginRequest;
import com.phishguard.dto.SignUpRequest;
import com.phishguard.entity.AuthProvider;
import com.phishguard.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        JwtAuthenticationResponse jwtAuthenticationResponse = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(jwtAuthenticationResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        authService.registerUser(signUpRequest);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/oauth/google")
    public ResponseEntity<?> googleLoginMock(@RequestParam String email, @RequestParam String name) {
        JwtAuthenticationResponse jwtAuthenticationResponse = authService.oauthLogin(email, name, AuthProvider.GOOGLE);
        return ResponseEntity.ok(jwtAuthenticationResponse);
    }
    
    @GetMapping("/oauth/github")
    public ResponseEntity<?> githubLoginMock(@RequestParam String email, @RequestParam String name) {
        JwtAuthenticationResponse jwtAuthenticationResponse = authService.oauthLogin(email, name, AuthProvider.GITHUB);
        return ResponseEntity.ok(jwtAuthenticationResponse);
    }
}
