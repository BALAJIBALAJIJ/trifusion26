package com.trifusion.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private long totalRegistrations;
    private long totalTeams;
    private long totalParticipants;
    private Map<String, Long> paymentsByStatus;
    private Map<String, Long> registrationsByStatus;
    private Map<String, Long> registrationsByTrack;
}
