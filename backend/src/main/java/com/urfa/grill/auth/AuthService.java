package com.urfa.grill.auth;

import com.urfa.grill.dto.AuthResponse;
import com.urfa.grill.dto.LoginRequest;
import com.urfa.grill.dto.RegisterRequest;
import com.urfa.grill.profile.CompanyProfile;
import com.urfa.grill.profile.CustomerProfile;
import com.urfa.grill.security.JwtService;
import com.urfa.grill.user.Role;
import com.urfa.grill.user.User;
import com.urfa.grill.user.UserRepository;
import java.util.Map;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalStateException("Email already registered");
        }

        if (request.getRole() == Role.ADMIN) {
            throw new IllegalStateException("Admin registration is not allowed");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        if (request.getRole() == Role.USER) {
            requireNonBlank(request.getFullName(), "Full name is required");
            CustomerProfile profile = new CustomerProfile();
            profile.setUser(user);
            profile.setFullName(request.getFullName());
            profile.setPhone(request.getPhone());
            profile.setDeliveryAddress(request.getDeliveryAddress());
            user.setCustomerProfile(profile);
        }

        if (request.getRole() == Role.COMPANY) {
            requireNonBlank(request.getCompanyName(), "Company name is required");
            CompanyProfile profile = new CompanyProfile();
            profile.setUser(user);
            profile.setCompanyName(request.getCompanyName());
            profile.setBranchAddress(request.getBranchAddress());
            profile.setContactEmail(request.getContactEmail());
            user.setCompanyProfile(profile);
        }

        User saved = userRepository.save(user);
        String accessToken = jwtService.generateAccessToken(saved.getEmail(), Map.of("role", saved.getRole().name()));
        return new AuthResponse(accessToken, saved.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        String accessToken = jwtService.generateAccessToken(user.getEmail(), Map.of("role", user.getRole().name()));
        return new AuthResponse(accessToken, user.getRole());
    }

    public String refreshToken(String subject) {
        return jwtService.generateAccessToken(subject, Map.of("role", userRepository.findByEmail(subject)
                .orElseThrow()
                .getRole()
                .name()));
    }

    public String generateRefreshToken(String subject) {
        return jwtService.generateRefreshToken(subject);
    }

    private void requireNonBlank(String value, String message) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalStateException(message);
        }
    }
}
