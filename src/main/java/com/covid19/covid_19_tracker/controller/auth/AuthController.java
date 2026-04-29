package com.covid19.covid_19_tracker.controller.auth;

import com.covid19.covid_19_tracker.dto.*;
import com.covid19.covid_19_tracker.model.User;
import com.covid19.covid_19_tracker.repository.auth.UserRepository;
import com.covid19.covid_19_tracker.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {

        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByUsername(request.getUsername()).orElseThrow();

        String token = jwtService.generateToken(user.getUsername(), user.getRole());

        return AuthResponse.builder()
                .token(token)
                .message("Login successful")
                .build();
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return "Username already exists";
        }

        String role = (request.getRole() == null || request.getRole().isBlank())
                ? "USER"
                : request.getRole().trim().toUpperCase(Locale.ROOT);

        if (!"USER".equals(role) && !"ADMIN".equals(role)) {
            return "Invalid role. Use USER or ADMIN";
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        userRepository.save(user);

        if ("ADMIN".equals(role)) {
            return "Admin registered successfully";
        } else {
            return "User registered successfully";
        }
    }
}