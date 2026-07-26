package com.urfa.grill.controller;

import com.urfa.grill.dto.CreateOrderRequest;
import com.urfa.grill.dto.UpdateOrderStatusRequest;
import com.urfa.grill.order.Order;
import com.urfa.grill.order.OrderService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public Order createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return orderService.createOrder(request);
    }

    @GetMapping
    public List<Order> getMyOrders() {
        return orderService.getOrdersForCurrentUser();
    }

    @PatchMapping("/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COMPANY')")
    public Order updateStatus(@PathVariable Long orderId, @Valid @RequestBody UpdateOrderStatusRequest request) {
        return orderService.updateStatus(orderId, request.getStatus());
    }
}
