package com.expense.repository;

import com.expense.entity.BudgetAdvice;
import com.expense.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BudgetAdviceRepository extends JpaRepository<BudgetAdvice, Long> {

    List<BudgetAdvice> findByUser(User user);
}
