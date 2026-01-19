package com.expense.dto;

import java.util.Map;

public class AnalyticsResponse {

    private Map<String, Double> categoryTotals;
    private double totalSpent;
    private double savings;
    private String advice;

    public AnalyticsResponse() {}

    public AnalyticsResponse(Map<String, Double> categoryTotals,
                             double totalSpent,
                             double savings,
                             String advice) {
        this.categoryTotals = categoryTotals;
        this.totalSpent = totalSpent;
        this.savings = savings;
        this.advice = advice;
    }

    public Map<String, Double> getCategoryTotals() {
        return categoryTotals;
    }

    public double getTotalSpent() {
        return totalSpent;
    }

    public double getSavings() {
        return savings;
    }

    public String getAdvice() {
        return advice;
    }
}
