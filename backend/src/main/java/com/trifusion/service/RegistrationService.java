package com.trifusion.service;

import com.trifusion.dto.RegistrationRequest;
import com.trifusion.dto.RegistrationResponse;
import com.trifusion.exception.DuplicateResourceException;
import com.trifusion.exception.NotFoundException;
import com.trifusion.exception.ValidationException;
import com.trifusion.model.Payment;
import com.trifusion.model.Registration;
import com.trifusion.model.RegistrationStatus;
import com.trifusion.model.TeamMember;
import com.trifusion.model.User;
import com.trifusion.repository.PaymentRepository;
import com.trifusion.repository.RegistrationRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final PaymentRepository paymentRepository;
    private final AuthService authService;

    public RegistrationService(RegistrationRepository registrationRepository,
                               PaymentRepository paymentRepository,
                               AuthService authService) {
        this.registrationRepository = registrationRepository;
        this.paymentRepository = paymentRepository;
        this.authService = authService;
    }

    public RegistrationResponse createRegistration(RegistrationRequest request) {
        User currentUser = authService.getCurrentUser();

        if (registrationRepository.findByUserId(currentUser.getId()).isPresent()) {
            throw new DuplicateResourceException("You have already registered a team");
        }

        if (registrationRepository.existsByTeamName(request.getTeamName())) {
            throw new DuplicateResourceException("Team name already exists");
        }

        validateEmails(request);

        Registration registration = Registration.builder()
                .userId(currentUser.getId())
                .teamName(request.getTeamName())
                .track(request.getTrack())
                .collegeName(request.getCollegeName())
                .leader(request.getLeader())
                .members(request.getMembers())
                .status(RegistrationStatus.SUBMITTED) // Assuming submission moves to SUBMITTED
                .declarationAccepted(request.isDeclarationAccepted())
                .termsAccepted(request.isTermsAccepted())
                .build();

        registration = registrationRepository.save(registration);

        return RegistrationResponse.builder()
                .registration(registration)
                .build();
    }

    public RegistrationResponse getMyRegistration() {
        User currentUser = authService.getCurrentUser();
        
        Registration registration = registrationRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new NotFoundException("Registration not found"));
                
        Payment payment = paymentRepository.findByRegistrationId(registration.getId()).orElse(null);

        return RegistrationResponse.builder()
                .registration(registration)
                .payment(payment)
                .build();
    }

    public RegistrationResponse updateMyRegistration(RegistrationRequest request) {
        User currentUser = authService.getCurrentUser();
        
        Registration registration = registrationRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new NotFoundException("Registration not found"));

        if (registration.getStatus() != RegistrationStatus.DRAFT && 
            registration.getStatus() != RegistrationStatus.SUBMITTED &&
            registration.getStatus() != RegistrationStatus.REJECTED) {
            throw new ValidationException("Cannot update registration in current status: " + registration.getStatus());
        }

        if (!registration.getTeamName().equals(request.getTeamName()) && 
            registrationRepository.existsByTeamName(request.getTeamName())) {
            throw new DuplicateResourceException("Team name already exists");
        }

        validateEmails(request);

        registration.setTeamName(request.getTeamName());
        registration.setTrack(request.getTrack());
        registration.setCollegeName(request.getCollegeName());
        registration.setLeader(request.getLeader());
        registration.setMembers(request.getMembers());
        
        if (registration.getStatus() == RegistrationStatus.REJECTED) {
            registration.setStatus(RegistrationStatus.SUBMITTED);
        }

        registration = registrationRepository.save(registration);
        
        Payment payment = paymentRepository.findByRegistrationId(registration.getId()).orElse(null);

        return RegistrationResponse.builder()
                .registration(registration)
                .payment(payment)
                .build();
    }

    private void validateEmails(RegistrationRequest request) {
        Set<String> emails = new HashSet<>();
        emails.add(request.getLeader().getEmail());
        
        for (TeamMember member : request.getMembers()) {
            if (!emails.add(member.getEmail())) {
                throw new ValidationException("Duplicate email found within team members: " + member.getEmail());
            }
        }
    }
}
