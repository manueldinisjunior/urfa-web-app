package com.urfa.grill.dto;

import com.urfa.grill.user.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfileResponse {
    private String email;
    private Role role;
    private String fullName;
    private String phone;
    private String deliveryAddress;
    private String companyName;
    private String branchAddress;
    private String contactEmail;
}
