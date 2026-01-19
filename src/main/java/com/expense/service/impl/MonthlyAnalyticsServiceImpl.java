package com.expense.service.impl;

import com.expense.dto.AnalyticsResponse;
import com.expense.entity.Expense;
import com.expense.entity.User;
import com.expense.repository.ExpenseRepository;
import com.expense.repository.UserRepository;
import com.expense.service.MonthlyAnalyticsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MonthlyAnalyticsServiceImpl implements MonthlyAnalyticsService {

	private final ExpenseRepository expenseRepository;
	private final UserRepository userRepository;

	public MonthlyAnalyticsServiceImpl(ExpenseRepository expenseRepository, UserRepository userRepository) {
		this.expenseRepository = expenseRepository;
		this.userRepository = userRepository;
	}

	@Override
	public ResponseEntity<AnalyticsResponse> generateMonthlyReport(String username) {

		try {
			User user = userRepository.findByUsername(username)
					.orElseThrow(() -> new RuntimeException("User not found"));

			List<Expense> expenses = expenseRepository.findByUser(user);

			Map<String, Double> categoryTotals = new HashMap<>();
			double totalSpent = 0;

			for (Expense e : expenses) {
				categoryTotals.put(e.getCategory(), categoryTotals.getOrDefault(e.getCategory(), 0.0) + e.getAmount());
				totalSpent += e.getAmount();
			}

			double monthlyIncome = user.getMonthlyIncome();
			double savings = monthlyIncome - totalSpent;

			String advice;
			if (expenses.isEmpty()) {
				advice = "No expenses recorded yet. Start tracking to get insights.";
			} else if (savings < 0) {
				advice = "You are overspending. Reduce unnecessary expenses.";
			} else if (savings < monthlyIncome * 0.2) {
				advice = "Try to save at least 20% of your income.";
			} else {
				advice = "Great job! Your savings are healthy.";
			}

			AnalyticsResponse response = new AnalyticsResponse(categoryTotals, totalSpent, savings, advice);

			return ResponseEntity.ok(response);

		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(new AnalyticsResponse(new HashMap<>(), 0, 0, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
					new AnalyticsResponse(new HashMap<>(), 0, 0, "Unable to generate monthly analytics at the moment"));
		}
	}
}
