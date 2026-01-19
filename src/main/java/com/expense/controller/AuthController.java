package com.expense.controller;

import com.expense.dto.LoginRequest;
import com.expense.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(
            @RequestBody LoginRequest request) {

        // 🔥 Directly return service response
        return authService.login(
                request.getUsername(),
                request.getPassword()
        );
    }
}
