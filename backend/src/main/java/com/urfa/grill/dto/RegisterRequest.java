package com.urfa.grill.dto;

import com.urfa.grill.user.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterRequest {
    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    @NotNull
    private Role role;

    private String fullName;
    private String phone;
    private String deliveryAddress;
    private String companyName;
    private String branchAddress;
    private String contactEmail;
}
