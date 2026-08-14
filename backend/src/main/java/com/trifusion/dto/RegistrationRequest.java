package com.trifusion.dto;

import com.trifusion.model.TeamMember;
import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationRequest {
    
    @NotBlank(message = "Team name is required")
    private String teamName;
    
    @NotBlank(message = "Track is required")
    private String track;
    
    @NotBlank(message = "College name is required")
    private String collegeName;
    
    @NotNull(message = "Leader details are required")
    @Valid
    private TeamMember leader;
    
    @NotNull(message = "Team members are required")
    @Size(min = 1, max = 3, message = "Team must have 2 to 4 members in total (leader + 1 to 3 members)")
    @Valid
    private List<TeamMember> members;
    
    @AssertTrue(message = "You must accept the declaration")
    private boolean declarationAccepted;
    
    @AssertTrue(message = "You must accept the terms and conditions")
    private boolean termsAccepted;
}
