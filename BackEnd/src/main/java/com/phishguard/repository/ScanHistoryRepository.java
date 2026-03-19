package com.phishguard.repository;

import com.phishguard.entity.RiskLevel;
import com.phishguard.entity.ScanHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScanHistoryRepository extends MongoRepository<ScanHistory, String> {
    Page<ScanHistory> findByUserId(String userId, Pageable pageable);
    Page<ScanHistory> findByUserIdAndRiskLevel(String userId, RiskLevel riskLevel, Pageable pageable);
    
    // For Dashboard Stats
    Long countByUserId(String userId);
    List<ScanHistory> findTop5ByUserIdOrderByCreatedAtDesc(String userId);
    Long countByUserIdAndRiskLevelIn(String userId, List<RiskLevel> riskLevels);
    Long countByUserIdAndRiskLevel(String userId, RiskLevel riskLevel);
}
