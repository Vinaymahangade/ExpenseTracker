package com.expense.controller;

import com.expense.service.AiSuggestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin
public class AiSuggestionController {

    private final AiSuggestionService aiSuggestionService;

    public AiSuggestionController(AiSuggestionService aiSuggestionService) {
        this.aiSuggestionService = aiSuggestionService;
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> getSuggestions(Authentication authentication) {

        String username = authentication.getName();
        return aiSuggestionService.generateSuggestions(username);
    }
}
