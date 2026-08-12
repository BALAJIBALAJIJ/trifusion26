package com.trifusion.service;

import com.trifusion.dto.DashboardStats;
import com.trifusion.dto.RegistrationResponse;
import com.trifusion.exception.NotFoundException;
import com.trifusion.model.Payment;
import com.trifusion.model.PaymentStatus;
import com.trifusion.model.Registration;
import com.trifusion.model.RegistrationStatus;
import com.trifusion.repository.PaymentRepository;
import com.trifusion.repository.RegistrationRepository;
import com.trifusion.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class AdminService {

    private final RegistrationRepository registrationRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final AuthService authService;

    public AdminService(RegistrationRepository registrationRepository,
                        PaymentRepository paymentRepository,
                        UserRepository userRepository,
                        AuthService authService) {
        this.registrationRepository = registrationRepository;
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.authService = authService;
    }

    public DashboardStats getDashboardStats() {
        long totalRegistrations = registrationRepository.count();
        long totalTeams = registrationRepository.count(); // One team per registration
        
        // Count participants
        long totalParticipants = registrationRepository.findAll().stream()
                .mapToLong(reg -> 1 + (reg.getMembers() != null ? reg.getMembers().size() : 0))
                .sum();

        Map<String, Long> paymentsByStatus = new HashMap<>();
        for (PaymentStatus status : PaymentStatus.values()) {
            paymentsByStatus.put(status.name(), paymentRepository.countByStatus(status));
        }

        Map<String, Long> registrationsByStatus = new HashMap<>();
        for (RegistrationStatus status : RegistrationStatus.values()) {
            registrationsByStatus.put(status.name(), registrationRepository.countByStatus(status));
        }

        // Just basic tracks
        Map<String, Long> registrationsByTrack = new HashMap<>();
        // In real app, might want to aggregate this from DB
        
        return DashboardStats.builder()
                .totalRegistrations(totalRegistrations)
                .totalTeams(totalTeams)
                .totalParticipants(totalParticipants)
                .paymentsByStatus(paymentsByStatus)
                .registrationsByStatus(registrationsByStatus)
                .registrationsByTrack(registrationsByTrack)
                .build();
    }

    public Page<Registration> getRegistrations(String search, Pageable pageable) {
        if (search != null && !search.trim().isEmpty()) {
            return registrationRepository.searchByTeamOrCollege(search, pageable);
        }
        return registrationRepository.findAll(pageable);
    }

    public RegistrationResponse getRegistrationDetails(String id) {
        Registration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Registration not found"));
                
        Payment payment = paymentRepository.findByRegistrationId(registration.getId()).orElse(null);

        return RegistrationResponse.builder()
                .registration(registration)
                .payment(payment)
                .build();
    }

    public void updateRegistrationStatus(String id, RegistrationStatus status) {
        Registration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Registration not found"));
                
        registration.setStatus(status);
        registrationRepository.save(registration);
    }

    public void verifyPayment(String id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Payment not found"));
                
        payment.setStatus(PaymentStatus.PAID);
        payment.setVerifiedAt(LocalDateTime.now());
        payment.setVerifiedBy(authService.getCurrentUser().getEmail());
        paymentRepository.save(payment);
        
        Registration registration = registrationRepository.findById(payment.getRegistrationId())
                .orElseThrow(() -> new NotFoundException("Registration not found"));
                
        registration.setStatus(RegistrationStatus.PAYMENT_VERIFIED);
        registrationRepository.save(registration);
    }

    public void rejectPayment(String id, String reason) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Payment not found"));
                
        payment.setStatus(PaymentStatus.REJECTED);
        payment.setRejectionReason(reason);
        payment.setVerifiedAt(LocalDateTime.now());
        payment.setVerifiedBy(authService.getCurrentUser().getEmail());
        paymentRepository.save(payment);
        
        Registration registration = registrationRepository.findById(payment.getRegistrationId())
                .orElseThrow(() -> new NotFoundException("Registration not found"));
                
        registration.setStatus(RegistrationStatus.REJECTED);
        registrationRepository.save(registration);
    }
}
