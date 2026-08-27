package com.ecommerce.order.service;

import com.ecommerce.order.client.ProductServiceClient;
import com.ecommerce.order.dto.OrderItemDto;
import com.ecommerce.order.dto.OrderRequest;
import com.ecommerce.order.dto.OrderResponse;
import com.ecommerce.order.dto.ProductDto;
import com.ecommerce.order.dto.StockCheckResponse;
import com.ecommerce.order.model.Cart;
import com.ecommerce.order.model.CartItem;
import com.ecommerce.order.model.Order;
import com.ecommerce.order.model.OrderItem;
import com.ecommerce.order.model.OrderStatus;
import com.ecommerce.order.repository.CartRepository;
import com.ecommerce.order.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductServiceClient productServiceClient;

    public OrderService(OrderRepository orderRepository,
                        CartRepository cartRepository,
                        ProductServiceClient productServiceClient) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.productServiceClient = productServiceClient;
    }

    /**
     * Place and Pay for Order:
     * 1. Verifies stock availability (rejects payment if stock is 0 or insufficient).
     * 2. Immediately deducts inventory stock from Product Microservice upon successful payment.
     * 3. Creates confirmed order and clears cart.
     */
    public OrderResponse placeOrder(OrderRequest request) {
        List<OrderItemDto> itemsToOrder = new ArrayList<>();

        if (request.getItems() != null && !request.getItems().isEmpty()) {
            itemsToOrder.addAll(request.getItems());
        } else {
            // Take items from user's active cart
            Optional<Cart> cartOpt = cartRepository.findByUserId(request.getUserId());
            if (cartOpt.isEmpty() || cartOpt.get().getItems().isEmpty()) {
                throw new IllegalArgumentException("Cannot place order: Cart is empty and no items specified.");
            }
            Cart cart = cartOpt.get();
            for (CartItem item : cart.getItems()) {
                itemsToOrder.add(new OrderItemDto(
                        item.getProductId(),
                        item.getQuantity(),
                        item.getPrice(),
                        item.getProductName(),
                        item.getImageUrl()
                ));
            }
        }

        if (itemsToOrder.isEmpty()) {
            throw new IllegalArgumentException("Cannot place an empty order.");
        }

        // Step 1: Strict Stock Verification (Prevent others from paying if stock is 0 or insufficient)
        for (OrderItemDto item : itemsToOrder) {
            StockCheckResponse check = productServiceClient.checkStock(item.getProductId(), item.getQuantity());
            if (!check.isAvailable() || check.getCurrentStock() < item.getQuantity()) {
                String errorMsg = "Cannot pay for '" + item.getProductName() + "': Product is OUT OF STOCK (Available: " + check.getCurrentStock() + ", Requested: " + item.getQuantity() + "). Payment declined.";
                log.warn("Payment declined: {}", errorMsg);
                throw new IllegalStateException(errorMsg);
            }
        }

        // Step 2: Deduct stock immediately upon payment
        double subtotal = 0.0;
        for (OrderItemDto item : itemsToOrder) {
            // Deduct stock in Product Service
            try {
                productServiceClient.reduceStock(item.getProductId(), item.getQuantity());
                log.info("Payment confirmed: Deducted {} units of Product #{} ({}) from inventory stock.",
                        item.getQuantity(), item.getProductId(), item.getProductName());
            } catch (Exception e) {
                log.error("Failed to deduct stock for product {}: {}", item.getProductId(), e.getMessage());
                throw new IllegalStateException("Payment failed during inventory deduction: " + e.getMessage());
            }

            if (item.getPrice() == null || item.getProductName() == null) {
                Optional<ProductDto> prodOpt = productServiceClient.getProductById(item.getProductId());
                if (prodOpt.isPresent()) {
                    ProductDto prod = prodOpt.get();
                    item.setPrice(prod.getPrice());
                    item.setProductName(prod.getName());
                    item.setImageUrl(prod.getImageUrl());
                }
            }
            subtotal += (item.getPrice() != null ? item.getPrice() : 0.0) * item.getQuantity();
        }

        double tax = Math.round((subtotal * 0.05) * 100.0) / 100.0;
        double shipping = subtotal > 1000 || subtotal == 0 ? 0.0 : 99.0;
        double totalAmount = Math.round((subtotal + tax + shipping) * 100.0) / 100.0;

        // Step 3: Create and persist the Order (stockDeducted = true)
        Order order = new Order(
                request.getUserId(),
                totalAmount,
                OrderStatus.CONFIRMED,
                request.getCustomerName() != null ? request.getCustomerName() : "Valued Customer",
                request.getCustomerEmail() != null ? request.getCustomerEmail() : "customer@example.com",
                request.getCustomerPhone() != null ? request.getCustomerPhone() : "+91 9876543210",
                request.getShippingAddress() != null ? request.getShippingAddress() : "123 Main Street, Tech City, India",
                request.getPaymentMethod() != null ? request.getPaymentMethod() : "Credit Card"
        );
        order.setStockDeducted(true);

        for (OrderItemDto itemDto : itemsToOrder) {
            OrderItem orderItem = new OrderItem(
                    order,
                    itemDto.getProductId(),
                    itemDto.getQuantity(),
                    itemDto.getPrice(),
                    itemDto.getProductName(),
                    itemDto.getImageUrl()
            );
            order.addOrderItem(orderItem);
        }

        Order savedOrder = orderRepository.save(order);
        log.info("Order #{} placed and paid successfully. Inventory updated.", savedOrder.getId());

        // Step 4: Clear user cart upon successful order
        cartRepository.findByUserId(request.getUserId()).ifPresent(cart -> {
            cart.getItems().clear();
            cartRepository.save(cart);
        });

        return mapToResponse(savedOrder);
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .sorted((a, b) -> b.getOrderDate().compareTo(a.getOrderDate()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Optional<OrderResponse> getOrderById(Long orderId) {
        return orderRepository.findById(orderId).map(this::mapToResponse);
    }

    /**
     * Update order delivery status (CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
     * If an order is CANCELLED by Admin, it restores the inventory stock.
     */
    public Optional<OrderResponse> updateOrderStatus(Long orderId, OrderStatus newStatus) {
        return orderRepository.findById(orderId).map(order -> {
            OrderStatus previousStatus = order.getStatus();
            order.setStatus(newStatus);

            // If order was paid (stock was deducted) and is now CANCELLED, restore stock
            if (newStatus == OrderStatus.CANCELLED && order.isStockDeducted()) {
                log.info("Order #{} cancelled. Restoring inventory stock for {} items...", orderId, order.getItems().size());
                for (OrderItem item : order.getItems()) {
                    try {
                        productServiceClient.restoreStock(item.getProductId(), item.getQuantity());
                        log.info("Restored {} units of Product #{} ({}) to stock", item.getQuantity(), item.getProductId(), item.getProductName());
                    } catch (Exception e) {
                        log.error("Failed to restore stock for product {}: {}", item.getProductId(), e.getMessage());
                    }
                }
                order.setStockDeducted(false);
            }

            Order updated = orderRepository.save(order);
            log.info("Order #{} status updated from {} to {}", orderId, previousStatus, newStatus);
            return mapToResponse(updated);
        });
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItemDto> itemDtos = order.getItems().stream()
                .map(item -> new OrderItemDto(
                        item.getProductId(),
                        item.getQuantity(),
                        item.getPrice(),
                        item.getProductName(),
                        item.getImageUrl()
                ))
                .collect(Collectors.toList());

        return new OrderResponse(
                order.getId(),
                order.getUserId(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getOrderDate(),
                order.getCustomerName(),
                order.getCustomerEmail(),
                order.getCustomerPhone(),
                order.getShippingAddress(),
                order.getPaymentMethod(),
                itemDtos
        );
    }
}
