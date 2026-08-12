package com.trifusion.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "payments")
public class Payment {
    @Id
    private String id;
    
    @Indexed
    private String registrationId;
    
    @Indexed
    private String userId;
    
    private String utrNumber;
    
    private String screenshotUrl;
    
    private String screenshotPublicId;
    
    private Double amount;
    
    private PaymentStatus status;
    
    @CreatedDate
    private LocalDateTime submittedAt;
    
    private LocalDateTime verifiedAt;
    
    private String verifiedBy;
    
    private String rejectionReason;
}
