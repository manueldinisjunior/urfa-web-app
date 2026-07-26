package com.urfa.grill.dto;

import com.urfa.grill.user.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private Role role;
}
