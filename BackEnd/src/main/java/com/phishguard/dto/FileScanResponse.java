package com.phishguard.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FileScanResponse {
    private boolean malicious;
    private String threatLevel;
    private String details;
}
