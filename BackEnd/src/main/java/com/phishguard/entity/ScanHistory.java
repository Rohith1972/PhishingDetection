package com.phishguard.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Document(collection = "scan_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScanHistory {

    @Id
    private String id;

    private String userId;

    private ScanType type;

    private String input;

    private String result;

    private Integer riskScore;

    private RiskLevel riskLevel;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
