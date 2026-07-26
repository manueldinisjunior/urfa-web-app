package com.urfa.grill.controller;

import com.urfa.grill.cart.Cart;
import com.urfa.grill.cart.CartService;
import com.urfa.grill.dto.AddCartItemRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public Cart getCart() {
        return cartService.getCurrentCart();
    }

    @PostMapping("/items")
    public Cart addItem(@Valid @RequestBody AddCartItemRequest request) {
        return cartService.addItem(request.getProductId(), request.getQuantity());
    }
}
