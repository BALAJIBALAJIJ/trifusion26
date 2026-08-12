package com.trifusion.controller;

import com.trifusion.dto.ApiResponse;
import com.trifusion.dto.PaymentRequest;
import com.trifusion.dto.PaymentResponse;
import com.trifusion.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping(value = "/submit", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<PaymentResponse>> submitPayment(@Valid @ModelAttribute PaymentRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Payment submitted successfully", 
                paymentService.submitPayment(request)));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<PaymentResponse>> getMyPayment() {
        return ResponseEntity.ok(ApiResponse.success("Payment details", 
                paymentService.getMyPayment()));
    }
}
