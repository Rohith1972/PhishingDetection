package com.phishguard.service;

import com.phishguard.dto.DashboardResponse;
import com.phishguard.entity.RiskLevel;
import com.phishguard.repository.ScanHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired
    private ScanHistoryRepository scanHistoryRepository;

    public DashboardResponse getDashboardStats(String userId) {
        long totalScans = scanHistoryRepository.countByUserId(userId);
        long threatsDetected = scanHistoryRepository.countByUserIdAndRiskLevelIn(userId, Arrays.asList(RiskLevel.HIGH, RiskLevel.MEDIUM));
        long safeResults = scanHistoryRepository.countByUserIdAndRiskLevel(userId, RiskLevel.LOW);
        
        Map<String, Long> distribution = new HashMap<>();
        distribution.put("low", safeResults);
        distribution.put("medium", scanHistoryRepository.countByUserIdAndRiskLevel(userId, RiskLevel.MEDIUM));
        distribution.put("high", scanHistoryRepository.countByUserIdAndRiskLevel(userId, RiskLevel.HIGH));

        return DashboardResponse.builder()
                .totalScans(totalScans)
                .threatsDetected(threatsDetected)
                .safeResults(safeResults)
                .riskDistribution(distribution)
                .build();
    }
}
