package com.expense.service.impl;

import com.expense.entity.Expense;
import com.expense.entity.User;
import com.expense.repository.ExpenseRepository;
import com.expense.repository.UserRepository;
import com.expense.service.AiSuggestionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AiSuggestionServiceImpl implements AiSuggestionService {

	private final ExpenseRepository expenseRepository;
	private final UserRepository userRepository;

	public AiSuggestionServiceImpl(ExpenseRepository expenseRepository, UserRepository userRepository) {
		this.expenseRepository = expenseRepository;
		this.userRepository = userRepository;
	}

	@Override
	public ResponseEntity<List<String>> generateSuggestions(String username) {

		try {
			User user = userRepository.findByUsername(username)
					.orElseThrow(() -> new RuntimeException("User not found"));

			List<Expense> expenses = expenseRepository.findByUser(user);

			double totalExpense = expenses.stream().mapToDouble(Expense::getAmount).sum();

			List<String> suggestions = new ArrayList<>();

			// 🔹 Rule 1: High overall spending
			if (totalExpense > user.getMonthlyIncome() * 0.8) {
				suggestions.add("You are spending more than 80% of your income. Try reducing non-essential expenses.");
			}

			// 🔹 Rule 2: Food expense frequency
			long foodCount = expenses.stream().filter(e -> "Food".equalsIgnoreCase(e.getCategory())).count();

			if (foodCount > 10) {
				suggestions.add("You spend frequently on food. Meal planning could help you save more.");
			}

			// 🔹 Rule 3: No expenses case
			if (expenses.isEmpty()) {
				suggestions.add("No expenses recorded yet. Start tracking to get personalized insights.");
			}

			// 🔹 Default suggestion
			if (suggestions.isEmpty()) {
				suggestions.add("Your spending looks balanced. Keep tracking your expenses regularly.");
			}

			return ResponseEntity.ok(suggestions);

		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(List.of(e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(List.of("Unable to generate suggestions at the moment. Please try again later."));
		}
	}
}
