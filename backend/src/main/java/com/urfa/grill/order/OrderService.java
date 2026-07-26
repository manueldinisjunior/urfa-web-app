package com.urfa.grill.order;

import com.urfa.grill.cart.Cart;
import com.urfa.grill.cart.CartItem;
import com.urfa.grill.cart.CartRepository;
import com.urfa.grill.cart.CartService;
import com.urfa.grill.dto.CreateOrderRequest;
import com.urfa.grill.user.User;
import com.urfa.grill.user.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository,
                        CartService cartService,
                        CartRepository cartRepository,
                        UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.cartService = cartService;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        Cart cart = cartService.getCurrentCart();
        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }

        User user = getCurrentUser();
        Order order = new Order();
        order.setUser(user);
        order.setType(request.getType());
        order.setDeliveryAddress(request.getDeliveryAddress());

        BigDecimal total = BigDecimal.ZERO;
        for (CartItem cartItem : cart.getItems()) {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(cartItem.getProduct());
            item.setQuantity(cartItem.getQuantity());
            item.setPrice(cartItem.getProduct().getPrice());
            order.getItems().add(item);
            total = total.add(cartItem.getProduct().getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }
        order.setTotal(total);

        Order saved = orderRepository.save(order);
        cart.getItems().clear();
        cartRepository.save(cart);
        return saved;
    }

    public List<Order> getOrdersForCurrentUser() {
        User user = getCurrentUser();
        return orderRepository.findByUserId(user.getId());
    }

    @Transactional
    public Order updateStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        order.setStatus(status);
        return orderRepository.save(order);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }
}
