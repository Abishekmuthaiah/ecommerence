package com.ecommerce.order.service;

import com.ecommerce.order.client.ProductServiceClient;
import com.ecommerce.order.dto.CartItemRequest;
import com.ecommerce.order.dto.CartItemResponse;
import com.ecommerce.order.dto.CartResponse;
import com.ecommerce.order.dto.ProductDto;
import com.ecommerce.order.dto.StockCheckResponse;
import com.ecommerce.order.model.Cart;
import com.ecommerce.order.model.CartItem;
import com.ecommerce.order.repository.CartItemRepository;
import com.ecommerce.order.repository.CartRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductServiceClient productServiceClient;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductServiceClient productServiceClient) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productServiceClient = productServiceClient;
    }

    public Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart(userId);
                    return cartRepository.save(newCart);
                });
    }

    public CartResponse getCartResponse(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return buildCartResponse(cart);
    }

    public CartResponse addItemToCart(Long userId, CartItemRequest request) {
        Cart cart = getOrCreateCart(userId);

        // Fetch product information from Product Microservice
        ProductDto product = productServiceClient.getProductById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + request.getProductId()));

        // Check if item already in cart
        Optional<CartItem> existingItemOpt = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(request.getProductId()))
                .findFirst();

        int targetQuantity = request.getQuantity();
        if (existingItemOpt.isPresent()) {
            targetQuantity += existingItemOpt.get().getQuantity();
        }

        // Verify stock with Product Microservice
        StockCheckResponse stockCheck = productServiceClient.checkStock(request.getProductId(), targetQuantity);
        if (!stockCheck.isAvailable()) {
            throw new IllegalArgumentException("Insufficient stock! Available: " + stockCheck.getCurrentStock() + ", Requested: " + targetQuantity);
        }

        if (existingItemOpt.isPresent()) {
            CartItem existing = existingItemOpt.get();
            existing.setQuantity(targetQuantity);
            existing.setPrice(product.getPrice());
            existing.setProductName(product.getName());
            existing.setImageUrl(product.getImageUrl());
        } else {
            CartItem newItem = new CartItem(cart, product.getId(), request.getQuantity(), product.getPrice(), product.getName(), product.getImageUrl());
            cart.addItem(newItem);
        }

        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
        return buildCartResponse(cart);
    }

    public CartResponse updateItemQuantity(Long userId, Long productId, int quantity) {
        Cart cart = getOrCreateCart(userId);

        Optional<CartItem> itemOpt = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(productId))
                .findFirst();

        if (itemOpt.isEmpty()) {
            throw new IllegalArgumentException("Product not in cart");
        }

        CartItem item = itemOpt.get();
        if (quantity <= 0) {
            cart.removeItem(item);
            cartItemRepository.delete(item);
        } else {
            // Check stock
            StockCheckResponse stockCheck = productServiceClient.checkStock(productId, quantity);
            if (!stockCheck.isAvailable()) {
                throw new IllegalArgumentException("Insufficient stock! Available: " + stockCheck.getCurrentStock());
            }
            item.setQuantity(quantity);
        }

        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
        return buildCartResponse(cart);
    }

    public CartResponse removeItemFromCart(Long userId, Long productId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().removeIf(item -> {
            boolean match = item.getProductId().equals(productId);
            if (match) {
                cartItemRepository.delete(item);
            }
            return match;
        });

        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
        return buildCartResponse(cart);
    }

    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().clear();
        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
    }

    private CartResponse buildCartResponse(Cart cart) {
        List<CartItemResponse> itemResponses = new ArrayList<>();
        double subtotal = 0.0;
        int totalItems = 0;

        for (CartItem item : cart.getItems()) {
            double itemTotal = item.getPrice() * item.getQuantity();
            subtotal += itemTotal;
            totalItems += item.getQuantity();

            int currentStock = 99;
            try {
                Optional<ProductDto> p = productServiceClient.getProductById(item.getProductId());
                if (p.isPresent() && p.get().getStock() != null) {
                    currentStock = p.get().getStock();
                }
            } catch (Exception ignored) {}

            itemResponses.add(new CartItemResponse(
                    item.getId(),
                    item.getProductId(),
                    item.getProductName(),
                    item.getPrice(),
                    item.getQuantity(),
                    itemTotal,
                    item.getImageUrl(),
                    currentStock
            ));
        }

        double estimatedTax = Math.round((subtotal * 0.05) * 100.0) / 100.0;
        double shippingFee = subtotal > 0 && subtotal < 1000 ? 50.0 : 0.0; // Free shipping over 1000
        double finalTotal = Math.round((subtotal + estimatedTax + shippingFee) * 100.0) / 100.0;

        return new CartResponse(
                cart.getId(),
                cart.getUserId(),
                itemResponses,
                totalItems,
                subtotal,
                estimatedTax,
                shippingFee,
                finalTotal
        );
    }
}
