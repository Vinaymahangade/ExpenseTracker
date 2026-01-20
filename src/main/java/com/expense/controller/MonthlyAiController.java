package com.expense.controller;

import com.expense.dto.AnalyticsResponse;
import com.expense.service.MonthlyAnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin
public class MonthlyAiController {

    private final MonthlyAnalyticsService analyticsService;

    public MonthlyAiController(MonthlyAnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/monthly")
    public ResponseEntity<AnalyticsResponse> getMonthlyReport(Authentication authentication) {

        String username = authentication.getName();
        return analyticsService.generateMonthlyReport(username);
    }
    
    
}
