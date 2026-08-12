package com.trifusion.controller;

import com.trifusion.dto.ApiResponse;
import com.trifusion.dto.RegistrationRequest;
import com.trifusion.dto.RegistrationResponse;
import com.trifusion.service.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RegistrationResponse>> createRegistration(@Valid @RequestBody RegistrationRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Registration submitted successfully", 
                registrationService.createRegistration(request)));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<RegistrationResponse>> getMyRegistration() {
        return ResponseEntity.ok(ApiResponse.success("Registration details", 
                registrationService.getMyRegistration()));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<RegistrationResponse>> updateMyRegistration(@Valid @RequestBody RegistrationRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Registration updated successfully", 
                registrationService.updateMyRegistration(request)));
    }
}
