package com.phishguard.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MessageScanRequest {
    @NotBlank
    private String message;
}
