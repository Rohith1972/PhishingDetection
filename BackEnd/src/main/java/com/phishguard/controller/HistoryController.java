package com.phishguard.controller;

import com.phishguard.entity.RiskLevel;
import com.phishguard.entity.ScanHistory;
import com.phishguard.exception.ApiException;
import com.phishguard.repository.ScanHistoryRepository;
import com.phishguard.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    @Autowired
    private ScanHistoryRepository scanHistoryRepository;

    @GetMapping
    public ResponseEntity<Page<ScanHistory>> getHistory(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String riskLevel) {
            
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        if (riskLevel != null && !riskLevel.equalsIgnoreCase("ALL")) {
            return ResponseEntity.ok(scanHistoryRepository.findByUserIdAndRiskLevel(
                    user.getId(), RiskLevel.valueOf(riskLevel.toUpperCase()), pageRequest));
        }

        return ResponseEntity.ok(scanHistoryRepository.findByUserId(user.getId(), pageRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScanHistory> getHistoryById(@PathVariable String id, @AuthenticationPrincipal UserPrincipal user) {
        ScanHistory history = scanHistoryRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "History record not found"));
                
        if (!history.getUserId().equals(user.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Access denied");
        }
        
        return ResponseEntity.ok(history);
    }
}
