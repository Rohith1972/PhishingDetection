package com.phishguard.controller;

import com.phishguard.dto.FileScanResponse;
import com.phishguard.dto.MessageScanRequest;
import com.phishguard.dto.MessageScanResponse;
import com.phishguard.dto.ScanUrlRequest;
import com.phishguard.dto.ScanUrlResponse;
import com.phishguard.exception.ApiException;
import com.phishguard.security.UserPrincipal;
import com.phishguard.service.RateLimitingService;
import com.phishguard.service.ScanService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/scan")
public class ScanController {

    @Autowired
    private ScanService scanService;

    @Autowired
    private RateLimitingService rateLimitingService;

    @PostMapping("/url")
    public ResponseEntity<ScanUrlResponse> scanUrl(@Valid @RequestBody ScanUrlRequest request, @AuthenticationPrincipal UserPrincipal user) {
        checkRateLimit(user.getId());
        return ResponseEntity.ok(scanService.scanUrl(request, user.getId()));
    }

    @PostMapping("/message")
    public ResponseEntity<MessageScanResponse> scanMessage(@Valid @RequestBody MessageScanRequest request, @AuthenticationPrincipal UserPrincipal user) {
        checkRateLimit(user.getId());
        return ResponseEntity.ok(scanService.scanMessage(request, user.getId()));
    }

    @PostMapping("/file")
    public ResponseEntity<FileScanResponse> scanFile(@RequestParam("file") MultipartFile file, @AuthenticationPrincipal UserPrincipal user) {
        checkRateLimit(user.getId());
        if(file.isEmpty()) throw new ApiException(HttpStatus.BAD_REQUEST, "File is empty");
        return ResponseEntity.ok(scanService.scanFile(file, user.getId()));
    }

    @PostMapping("/trainMessageModel")
    public ResponseEntity<String> trainMessageModel(@AuthenticationPrincipal UserPrincipal user) {
        checkRateLimit(user.getId());
        try {
            String result = scanService.trainMessageModel();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to train model: " + e.getMessage());
        }
    }
    
    private void checkRateLimit(String userId) {
        if(!rateLimitingService.isAllowed(userId)) {
            throw new ApiException(HttpStatus.TOO_MANY_REQUESTS, "Rate limit exceeded. Try again later.");
        }
    }
}
