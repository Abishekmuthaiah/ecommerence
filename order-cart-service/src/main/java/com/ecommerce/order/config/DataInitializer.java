package com.ecommerce.order.config;

import com.ecommerce.order.model.Cart;
import com.ecommerce.order.model.CartItem;
import com.ecommerce.order.model.Order;
import com.ecommerce.order.model.OrderItem;
import com.ecommerce.order.model.OrderStatus;
import com.ecommerce.order.repository.CartRepository;
import com.ecommerce.order.repository.OrderRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;

    public DataInitializer(CartRepository cartRepository, OrderRepository orderRepository) {
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public void run(String... args) {
        // Seed initial demo cart for user 1
        if (cartRepository.count() == 0) {
            Cart cart1 = new Cart(1L);
            CartItem item1 = new CartItem(
                cart1,
                2L,
                1,
                800.0,
                "Logitech MX Master 3S Wireless Mouse",
                "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80"
            );
            cart1.addItem(item1);
            cartRepository.save(cart1);
        }

        // Seed a sample past order for user 1
        if (orderRepository.count() == 0) {
            Order pastOrder = new Order(
                1L,
                26250.0,
                OrderStatus.DELIVERED,
                "Alex Johnson",
                "alex.johnson@example.com",
                "+91 9876543210",
                "42 Silicon Avenue, Tech Park, Bangalore 560001",
                "UPI / Online"
            );

            OrderItem orderItem1 = new OrderItem(
                pastOrder,
                3L,
                1,
                25000.0,
                "Samsung Galaxy S24 Ultra 5G",
                "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80"
            );

            pastOrder.addOrderItem(orderItem1);
            orderRepository.save(pastOrder);
        }
    }
}
