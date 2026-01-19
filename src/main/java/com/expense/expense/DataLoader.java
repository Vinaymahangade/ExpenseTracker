package com.expense.expense;

import com.expense.entity.User;
import com.expense.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner loadUser(UserRepository repo,
                               PasswordEncoder passwordEncoder) {
        return args -> {

            if (!repo.existsByUsername("admin")) {

                User user = new User();
                user.setUsername("admin");
                user.setPassword(passwordEncoder.encode("admin123"));
                user.setMonthlyIncome(50000.0); // ✅ ADD THIS

                repo.save(user);
            }
        };
    }
}
