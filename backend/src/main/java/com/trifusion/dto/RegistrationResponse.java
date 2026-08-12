package com.trifusion.dto;

import com.trifusion.model.Registration;
import com.trifusion.model.Payment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationResponse {
    private Registration registration;
    private Payment payment;
}
