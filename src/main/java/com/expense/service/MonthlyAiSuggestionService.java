package com.expense.service;

import com.expense.dto.AiRequestDto;
import org.springframework.http.ResponseEntity;

public interface MonthlyAiSuggestionService {

    ResponseEntity<String> generateMonthlyAdvice(AiRequestDto data);
}
