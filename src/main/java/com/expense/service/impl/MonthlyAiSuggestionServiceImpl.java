package com.expense.service.impl;

import com.expense.dto.AiRequestDto;
import com.expense.service.MonthlyAiSuggestionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class MonthlyAiSuggestionServiceImpl implements MonthlyAiSuggestionService {

    @Override
    public ResponseEntity<String> generateMonthlyAdvice(AiRequestDto data) {

        try {
            if (data == null) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Invalid request data");
            }

            StringBuilder advice = new StringBuilder();
            advice.append("📊 Monthly Budget Analysis:\n\n");

            // 🔹 Profit / Loss analysis
            if (data.getProfitLoss() < 0) {
                advice.append("- You are overspending this month. Consider reducing non-essential expenses.\n");
            } else {
                advice.append("- You are within budget. Good financial discipline.\n");
            }

            // 🔹 Expense vs income ratio
            if (data.getTotalExpense() > data.getMonthlyIncome() * 0.8) {
                advice.append("- Expenses exceed 80% of income. Try saving at least 20%.\n");
            }

            // 🔹 Category-wise insights
            if (data.getCategorySummary() != null) {
                data.getCategorySummary().forEach((category, amount) -> {
                    if (amount > data.getMonthlyIncome() * 0.3) {
                        advice.append("- High spending in ")
                                .append(category)
                                .append(". Consider cutting down.\n");
                    }
                });
            }

            advice.append("\n💡 Tip: Track daily expenses to avoid month-end surprises.");

            return ResponseEntity.ok(advice.toString());

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unable to generate AI advice at the moment");
        }
    }
}
