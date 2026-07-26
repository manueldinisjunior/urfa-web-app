package com.urfa.grill.controller;

import com.urfa.grill.dto.ProfileResponse;
import com.urfa.grill.user.Role;
import com.urfa.grill.user.User;
import com.urfa.grill.user.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    private final UserRepository userRepository;

    public ProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ProfileResponse getProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        if (user.getRole() == Role.USER && user.getCustomerProfile() != null) {
            return new ProfileResponse(
                    user.getEmail(),
                    user.getRole(),
                    user.getCustomerProfile().getFullName(),
                    user.getCustomerProfile().getPhone(),
                    user.getCustomerProfile().getDeliveryAddress(),
                    null,
                    null,
                    null
            );
        }

        if (user.getRole() == Role.COMPANY && user.getCompanyProfile() != null) {
            return new ProfileResponse(
                    user.getEmail(),
                    user.getRole(),
                    null,
                    null,
                    null,
                    user.getCompanyProfile().getCompanyName(),
                    user.getCompanyProfile().getBranchAddress(),
                    user.getCompanyProfile().getContactEmail()
            );
        }

        return new ProfileResponse(user.getEmail(), user.getRole(), null, null, null, null, null, null);
    }
}
