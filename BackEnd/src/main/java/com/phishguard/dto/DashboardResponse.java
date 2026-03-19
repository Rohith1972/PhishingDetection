package com.phishguard.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class DashboardResponse {
    private long totalScans;
    private long threatsDetected;
    private long safeResults;
    private Map<String, Long> riskDistribution;
}
