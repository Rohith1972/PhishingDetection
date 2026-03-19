package com.phishguard.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class ScanUrlResponse {
    private int riskScore;
    private String status;
    private List<String> flags;
    private String explanation;
}
