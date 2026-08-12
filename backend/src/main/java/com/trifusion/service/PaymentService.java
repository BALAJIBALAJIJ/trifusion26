package com.trifusion.service;

import com.trifusion.dto.PaymentRequest;
import com.trifusion.dto.PaymentResponse;
import com.trifusion.exception.DuplicateResourceException;
import com.trifusion.exception.NotFoundException;
import com.trifusion.exception.ValidationException;
import com.trifusion.model.Payment;
import com.trifusion.model.PaymentStatus;
import com.trifusion.model.Registration;
import com.trifusion.model.RegistrationStatus;
import com.trifusion.model.User;
import com.trifusion.repository.PaymentRepository;
import com.trifusion.repository.RegistrationRepository;
import com.trifusion.util.FileValidator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Map;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final RegistrationRepository registrationRepository;
    private final CloudinaryService cloudinaryService;
    private final AuthService authService;

    public PaymentService(PaymentRepository paymentRepository,
                          RegistrationRepository registrationRepository,
                          CloudinaryService cloudinaryService,
                          AuthService authService) {
        this.paymentRepository = paymentRepository;
        this.registrationRepository = registrationRepository;
        this.cloudinaryService = cloudinaryService;
        this.authService = authService;
    }

    @Transactional
    public PaymentResponse submitPayment(PaymentRequest request) {
        User currentUser = authService.getCurrentUser();
        
        Registration registration = registrationRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new NotFoundException("Registration not found. Please register first."));
                
        if (registration.getStatus() == RegistrationStatus.PAYMENT_VERIFIED) {
            throw new ValidationException("Payment is already verified for this registration");
        }

        if (paymentRepository.findByRegistrationId(registration.getId()).isPresent() && 
            registration.getStatus() != RegistrationStatus.PAYMENT_PENDING && 
            registration.getStatus() != RegistrationStatus.REJECTED) {
            throw new DuplicateResourceException("Payment is already submitted and under review");
        }

        FileValidator.validateFile(request.getScreenshot());

        try {
            Map uploadResult = cloudinaryService.uploadFile(request.getScreenshot());
            
            Payment payment = paymentRepository.findByRegistrationId(registration.getId()).orElse(new Payment());
            payment.setUserId(currentUser.getId());
            payment.setRegistrationId(registration.getId());
            payment.setUtrNumber(request.getUtrNumber());
            payment.setAmount(request.getAmount());
            payment.setScreenshotUrl((String) uploadResult.get("secure_url"));
            payment.setScreenshotPublicId((String) uploadResult.get("public_id"));
            payment.setStatus(PaymentStatus.UNDER_REVIEW);
            payment.setRejectionReason(null);
            
            payment = paymentRepository.save(payment);
            
            registration.setStatus(RegistrationStatus.UNDER_REVIEW);
            registrationRepository.save(registration);
            
            return mapToResponse(payment);
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload screenshot", e);
        }
    }

    public PaymentResponse getMyPayment() {
        User currentUser = authService.getCurrentUser();
        Payment payment = paymentRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new NotFoundException("Payment not found"));
        return mapToResponse(payment);
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .registrationId(payment.getRegistrationId())
                .utrNumber(payment.getUtrNumber())
                .screenshotUrl(payment.getScreenshotUrl())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .submittedAt(payment.getSubmittedAt())
                .rejectionReason(payment.getRejectionReason())
                .build();
    }
}
