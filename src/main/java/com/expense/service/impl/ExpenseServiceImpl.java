package com.expense.service.impl;

import com.expense.entity.Expense;
import com.expense.entity.User;
import com.expense.repository.ExpenseRepository;
import com.expense.repository.UserRepository;
import com.expense.service.ExpenseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseServiceImpl(ExpenseRepository expenseRepository,
                              UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ResponseEntity<Expense> addExpense(Expense expense, String username) {

        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            expense.setUser(user);

            // 🔥 VERY IMPORTANT (SQL ERROR FIX)
            if (expense.getExpenseDate() == null) {
                expense.setExpenseDate(LocalDate.now());
            }

            Expense saved = expenseRepository.save(expense);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @Override
    public ResponseEntity<List<Expense>> getExpenses(String username) {

        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return ResponseEntity.ok(expenseRepository.findByUser(user));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Override
    public ResponseEntity<String> deleteExpense(Long expenseId, String username) {

        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Expense expense = expenseRepository.findById(expenseId)
                    .orElseThrow(() -> new RuntimeException("Expense not found"));

            if (!expense.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Unauthorized");
            }

            expenseRepository.delete(expense);
            return ResponseEntity.ok("Expense deleted successfully");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    // 🔥 MONTHLY ANALYTICS
    @Override
    public ResponseEntity<Map<String, Double>> getMonthlyAnalytics(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate now = LocalDate.now();

        List<Object[]> data = expenseRepository.categorySummary(
                user.getId(),
                now.getMonthValue(),
                now.getYear()
        );

        Map<String, Double> result = new HashMap<>();
        for (Object[] row : data) {
            result.put((String) row[0], (Double) row[1]);
        }

        return ResponseEntity.ok(result);
    }
}
