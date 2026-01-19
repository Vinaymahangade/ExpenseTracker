package com.expense.service;

import org.springframework.http.ResponseEntity;
import java.util.Map;

public interface AuthService {

    ResponseEntity<Map<String, String>> login(String username, String password);
}
