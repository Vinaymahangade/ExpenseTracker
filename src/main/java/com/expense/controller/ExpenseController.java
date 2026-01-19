package com.expense.controller;

import com.expense.entity.Expense;
import com.expense.service.ExpenseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public ResponseEntity<Expense> addExpense(@RequestBody Expense expense,
                                              Authentication authentication) {

        String username = authentication.getName();
        return expenseService.addExpense(expense, username);
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getExpenses(Authentication authentication) {

        String username = authentication.getName();
        return expenseService.getExpenses(username);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExpense(@PathVariable Long id,
                                                Authentication authentication) {

        String username = authentication.getName();
        return expenseService.deleteExpense(id, username);
    }
}
