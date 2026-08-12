package com.trifusion.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusUpdateRequest {
    @NotBlank(message = "Status is required")
    private String status;
    
    private String reason; // Used for rejections
}
