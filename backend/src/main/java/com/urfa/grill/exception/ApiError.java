package com.urfa.grill.exception;

import java.time.OffsetDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiError {
    private String message;
    private OffsetDateTime timestamp;
    private List<String> details;
}
