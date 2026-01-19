package com.expense.service;

import org.springframework.http.ResponseEntity;

import java.util.List;

public interface AiSuggestionService {

    ResponseEntity<List<String>> generateSuggestions(String username);
}
