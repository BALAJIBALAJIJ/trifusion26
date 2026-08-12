package com.trifusion.service;

import com.trifusion.dto.AuthRequest;
import com.trifusion.dto.AuthResponse;
import com.trifusion.dto.RegisterRequest;
import com.trifusion.exception.DuplicateResourceException;
import com.trifusion.exception.UnauthorizedException;
import com.trifusion.model.Role;
import com.trifusion.model.User;
import com.trifusion.repository.UserRepository;
import com.trifusion.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.PARTICIPANT)
                .build();

        user = userRepository.save(user);

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities("ROLE_" + user.getRole().name())
                .build();

        String token = jwtTokenProvider.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .profilePicture(user.getProfilePicture())
                .role(user.getRole())
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        String token = jwtTokenProvider.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .profilePicture(user.getProfilePicture())
                .role(user.getRole())
                .build();
    }

    public AuthResponse adminLogin(AuthRequest request) {
        if (!request.getEmail().equals(adminEmail) || !request.getPassword().equals(adminPassword)) {
            throw new UnauthorizedException("Invalid admin credentials");
        }

        User adminUser = userRepository.findByEmail(adminEmail).orElseGet(() -> {
            User newAdmin = User.builder()
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .fullName("Administrator")
                    .role(Role.ADMIN)
                    .build();
            return userRepository.save(newAdmin);
        });

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(adminUser.getEmail())
                .password(adminUser.getPassword())
                .authorities("ROLE_" + adminUser.getRole().name())
                .build();

        String token = jwtTokenProvider.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .id(adminUser.getId())
                .email(adminUser.getEmail())
                .fullName(adminUser.getFullName())
                .profilePicture(adminUser.getProfilePicture())
                .role(adminUser.getRole())
                .build();
    }

    /**
     * Google OAuth login - decodes the Google JWT credential,
     * finds or creates a user, and returns an app JWT token.
     */
    public AuthResponse googleLogin(String googleCredential) {
        try {
            // Decode Google JWT payload (base64url encoded)
            String[] parts = googleCredential.split("\\.");
            if (parts.length < 2) {
                throw new UnauthorizedException("Invalid Google credential");
            }

            String payload = parts[1];
            // Fix base64url padding
            String padded = payload;
            int mod = padded.length() % 4;
            if (mod > 0) {
                padded += "====".substring(mod);
            }
            padded = padded.replace('-', '+').replace('_', '/');

            byte[] decodedBytes = Base64.getDecoder().decode(padded);
            String jsonPayload = new String(decodedBytes, StandardCharsets.UTF_8);
            JsonNode decoded = objectMapper.readTree(jsonPayload);

            String email = decoded.has("email") ? decoded.get("email").asText() : null;
            String name = decoded.has("name") ? decoded.get("name").asText() : "";
            String picture = decoded.has("picture") ? decoded.get("picture").asText() : null;
            String googleId = decoded.has("sub") ? decoded.get("sub").asText() : null;

            if (email == null || email.isBlank()) {
                throw new UnauthorizedException("Google credential does not contain email");
            }

            // Find existing user or create new one
            User user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {
                // Create new participant
                user = User.builder()
                        .email(email)
                        .fullName(name)
                        .profilePicture(picture)
                        .googleId(googleId)
                        .password(passwordEncoder.encode("google-oauth-" + googleId))
                        .role(Role.PARTICIPANT)
                        .build();
                user = userRepository.save(user);
            } else {
                // Update profile info from Google
                user.setFullName(name);
                user.setProfilePicture(picture);
                user.setGoogleId(googleId);
                user = userRepository.save(user);
            }

            UserDetails userDetails = org.springframework.security.core.userdetails.User
                    .withUsername(user.getEmail())
                    .password(user.getPassword())
                    .authorities("ROLE_" + user.getRole().name())
                    .build();

            String token = jwtTokenProvider.generateToken(userDetails);

            return AuthResponse.builder()
                    .token(token)
                    .id(user.getId())
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .profilePicture(user.getProfilePicture())
                    .role(user.getRole())
                    .build();

        } catch (UnauthorizedException e) {
            throw e;
        } catch (Exception e) {
            throw new UnauthorizedException("Failed to process Google credential: " + e.getMessage());
        }
    }

    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            throw new UnauthorizedException("Not authenticated");
        }
        
        String email = ((UserDetails) auth.getPrincipal()).getUsername();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("User not found"));
    }
}
