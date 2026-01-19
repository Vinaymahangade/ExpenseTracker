package com.expense.dto;

import java.util.Map;

public class AiRequestDto {

    private double monthlyIncome;
    private double totalExpense;
    private double profitLoss;
    private Map<String, Double> categorySummary;

    public AiRequestDto() {}

    public AiRequestDto(double monthlyIncome,
                        double totalExpense,
                        double profitLoss,
                        Map<String, Double> categorySummary) {
        this.monthlyIncome = monthlyIncome;
        this.totalExpense = totalExpense;
        this.profitLoss = profitLoss;
        this.categorySummary = categorySummary;
    }

    public double getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(double monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public double getTotalExpense() {
        return totalExpense;
    }

    public void setTotalExpense(double totalExpense) {
        this.totalExpense = totalExpense;
    }

    public double getProfitLoss() {
        return profitLoss;
    }

    public void setProfitLoss(double profitLoss) {
        this.profitLoss = profitLoss;
    }

    public Map<String, Double> getCategorySummary() {
        return categorySummary;
    }

    public void setCategorySummary(Map<String, Double> categorySummary) {
        this.categorySummary = categorySummary;
    }
}
