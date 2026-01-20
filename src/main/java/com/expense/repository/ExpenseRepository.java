package com.expense.repository;

import com.expense.entity.Expense;
import com.expense.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

	List<Expense> findByUser(User user);

	List<Expense> findByUserAndExpenseDateBetween(User user, LocalDate startDate, LocalDate endDate);

	@Query("""
			    SELECT e.category, SUM(e.amount)
			    FROM Expense e
			    WHERE e.user.id = :userId
			    AND MONTH(e.expenseDate) = :month
			    AND YEAR(e.expenseDate) = :year
			    GROUP BY e.category
			""")
	List<Object[]> categorySummary(@Param("userId") Long userId, @Param("month") int month, @Param("year") int year);
}
