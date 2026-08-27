package com.ecommerce.order.controller;

import com.ecommerce.order.dto.CartItemRequest;
import com.ecommerce.order.dto.CartResponse;
import com.ecommerce.order.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    /**
     * GET /api/cart/{userId}
     * Retrieves the shopping cart for a given user
     */
    @GetMapping("/{userId}")
    public ResponseEntity<CartResponse> getCart(@PathVariable Long userId) {
        CartResponse response = cartService.getCartResponse(userId);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/cart/{userId}/items
     * Adds an item to the shopping cart
     */
    @PostMapping("/{userId}/items")
    public ResponseEntity<?> addItemToCart(
            @PathVariable Long userId,
            @Valid @RequestBody CartItemRequest request) {
        try {
            CartResponse response = cartService.addItemToCart(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * PUT /api/cart/{userId}/items/{productId}
     * Updates item quantity in the cart
     */
    @PutMapping("/{userId}/items/{productId}")
    public ResponseEntity<?> updateItemQuantity(
            @PathVariable Long userId,
            @PathVariable Long productId,
            @RequestParam int quantity) {
        try {
            CartResponse response = cartService.updateItemQuantity(userId, productId, quantity);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * DELETE /api/cart/{userId}/items/{productId}
     * Removes an item from the cart
     */
    @DeleteMapping("/{userId}/items/{productId}")
    public ResponseEntity<CartResponse> removeItem(
            @PathVariable Long userId,
            @PathVariable Long productId) {
        CartResponse response = cartService.removeItemFromCart(userId, productId);
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/cart/{userId}
     * Empties the entire cart
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok(Map.of("success", true, "message", "Cart cleared successfully", "userId", userId));
    }
}
