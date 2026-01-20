package com.expense.service;

import com.expense.entity.Expense;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface ExpenseService {

    ResponseEntity<Expense> addExpense(Expense expense, String username);

    ResponseEntity<List<Expense>> getExpenses(String username);

    ResponseEntity<String> deleteExpense(Long expenseId, String username);

    ResponseEntity<Map<String, Double>> getMonthlyAnalytics(String username);
}
