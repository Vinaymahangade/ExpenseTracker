package com.expense.service;

import com.expense.dto.AnalyticsResponse;
import org.springframework.http.ResponseEntity;

public interface MonthlyAnalyticsService {

    ResponseEntity<AnalyticsResponse> generateMonthlyReport(String username);
}
