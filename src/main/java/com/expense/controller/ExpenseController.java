package com.expense.controller;

import com.expense.entity.Expense;
import com.expense.service.ExpenseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public ResponseEntity<Expense> addExpense(
            @RequestBody Expense expense,
            Authentication authentication) {

        return expenseService.addExpense(
                expense,
                authentication.getName()
        );
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getExpenses(
            Authentication authentication) {

        return expenseService.getExpenses(
                authentication.getName()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExpense(
            @PathVariable Long id,
            Authentication authentication) {

        return expenseService.deleteExpense(
                id,
                authentication.getName()
        );
    }

    // 🔥 MONTHLY ANALYTICS
    @GetMapping("/analytics/monthly")
    public ResponseEntity<Map<String, Double>> monthlyAnalytics(
            Authentication authentication) {

        return expenseService.getMonthlyAnalytics(
                authentication.getName()
        );
    }
}
