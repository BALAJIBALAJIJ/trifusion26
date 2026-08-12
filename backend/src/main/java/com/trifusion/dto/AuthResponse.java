package com.trifusion.dto;

import com.trifusion.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String id;
    private String email;
    private String fullName;
    private String profilePicture;
    private Role role;
}
