package com.phishguard.controller;

import com.phishguard.dto.DashboardResponse;
import com.phishguard.security.UserPrincipal;
import com.phishguard.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboardStats(@AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(dashboardService.getDashboardStats(user.getId()));
    }
}
