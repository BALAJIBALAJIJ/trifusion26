package com.trifusion.dto;

import com.trifusion.model.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private String id;
    private String registrationId;
    private String utrNumber;
    private String screenshotUrl;
    private Double amount;
    private PaymentStatus status;
    private LocalDateTime submittedAt;
    private String rejectionReason;
}
