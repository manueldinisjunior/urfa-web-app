package com.urfa.grill.dto;

import com.urfa.grill.order.OrderType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateOrderRequest {
    @NotNull
    private OrderType type;
    private String deliveryAddress;
}
