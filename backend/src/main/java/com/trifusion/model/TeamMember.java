package com.trifusion.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamMember {
    @NotBlank(message = "Full name is required")
    private String fullName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\d{10}$", message = "Phone number must be 10 digits")
    private String phone;
    
    @NotBlank(message = "College name is required")
    private String collegeName;
    
    @NotBlank(message = "Department is required")
    private String department;
    
    @NotBlank(message = "Year of study is required")
    private String yearOfStudy;
    
    @NotBlank(message = "Roll number is required")
    private String rollNumber;
    
    @NotBlank(message = "Gender is required")
    private String gender;
}
