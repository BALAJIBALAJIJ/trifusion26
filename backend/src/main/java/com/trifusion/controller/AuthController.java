package com.trifusion.controller;

import com.trifusion.dto.ApiResponse;
import com.trifusion.dto.AuthRequest;
import com.trifusion.dto.AuthResponse;
import com.trifusion.dto.GoogleAuthRequest;
import com.trifusion.dto.RegisterRequest;
import com.trifusion.model.User;
import com.trifusion.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Registration successful", authService.register(request)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Login successful", authService.login(request)));
    }

    @PostMapping("/admin-login")
    public ResponseEntity<ApiResponse<AuthResponse>> adminLogin(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Admin login successful", authService.adminLogin(request)));
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<AuthResponse>> googleLogin(@Valid @RequestBody GoogleAuthRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Google login successful", authService.googleLogin(request.getCredential())));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser() {
        return ResponseEntity.ok(ApiResponse.success("Current user info", authService.getCurrentUser()));
    }
}

