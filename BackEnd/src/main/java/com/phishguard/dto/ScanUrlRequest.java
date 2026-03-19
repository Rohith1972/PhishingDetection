package com.phishguard.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ScanUrlRequest {
    @NotBlank
    private String url;
}
