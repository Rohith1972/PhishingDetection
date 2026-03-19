package com.phishguard.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class MessageScanResponse {
    private String classification;
    private int riskScore;
    private List<String> highlightedText;
    private String explanation;
}
