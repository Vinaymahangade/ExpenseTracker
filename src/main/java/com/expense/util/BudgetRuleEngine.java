package com.expense.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class BudgetRuleEngine {

    private static final double MIN_SAVINGS_PERCENT = 0.10; // 10%
    private static final double HIGH_CATEGORY_PERCENT = 0.30; // 30%

    private BudgetRuleEngine() {
        // Utility class
    }

    /**
     * Generate budget advice based on income & expenses
     */
    public static List<String> generateAdvice(
            double income,
            double totalExpense,
            Map<String, Double> categorySummary) {

        List<String> advice = new ArrayList<>();

        if (income <= 0) {
            advice.add("Income not configured properly. Please update your monthly income.");
            return advice;
        }

        // 🔹 Rule 1: Overspending
        if (totalExpense > income) {
            advice.add("You are spending more than your income. Reduce non-essential expenses.");
        }

        // 🔹 Rule 2: Low savings
        double savings = income - totalExpense;
        if (savings < income * MIN_SAVINGS_PERCENT) {
            advice.add("Your savings are below 10%. Try to save at least 10–20% of your income.");
        }

        // 🔹 Rule 3: High category spending
        if (categorySummary != null && !categorySummary.isEmpty()) {
            for (Map.Entry<String, Double> entry : categorySummary.entrySet()) {
                if (entry.getValue() > income * HIGH_CATEGORY_PERCENT) {
                    advice.add(
                        "High spending detected in " + entry.getKey()
                        + ". Consider reducing expenses in this category."
                    );
                }
            }
        }

        // 🔹 Default advice
        if (advice.isEmpty()) {
            advice.add("Your spending looks healthy. Keep maintaining this balance.");
        }

        return advice;
    }
}
