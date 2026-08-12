package com.trifusion.repository;

import com.trifusion.model.Payment;
import com.trifusion.model.PaymentStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
    Optional<Payment> findByRegistrationId(String registrationId);
    Optional<Payment> findByUserId(String userId);
    long countByStatus(PaymentStatus status);
}
