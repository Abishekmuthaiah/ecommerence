package com.ecommerce.order.dto;

import java.util.ArrayList;
import java.util.List;

public class CartResponse {
    private Long cartId;
    private Long userId;
    private List<CartItemResponse> items = new ArrayList<>();
    private int totalItems;
    private Double subtotal = 0.0;
    private Double estimatedTax = 0.0;
    private Double shippingFee = 0.0;
    private Double finalTotal = 0.0;

    public CartResponse() {
    }

    public CartResponse(Long cartId, Long userId, List<CartItemResponse> items, int totalItems, Double subtotal, Double estimatedTax, Double shippingFee, Double finalTotal) {
        this.cartId = cartId;
        this.userId = userId;
        this.items = items;
        this.totalItems = totalItems;
        this.subtotal = subtotal;
        this.estimatedTax = estimatedTax;
        this.shippingFee = shippingFee;
        this.finalTotal = finalTotal;
    }

    public Long getCartId() {
        return cartId;
    }

    public void setCartId(Long cartId) {
        this.cartId = cartId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<CartItemResponse> getItems() {
        return items;
    }

    public void setItems(List<CartItemResponse> items) {
        this.items = items;
    }

    public int getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(int totalItems) {
        this.totalItems = totalItems;
    }

    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }

    public Double getEstimatedTax() {
        return estimatedTax;
    }

    public void setEstimatedTax(Double estimatedTax) {
        this.estimatedTax = estimatedTax;
    }

    public Double getShippingFee() {
        return shippingFee;
    }

    public void setShippingFee(Double shippingFee) {
        this.shippingFee = shippingFee;
    }

    public Double getFinalTotal() {
        return finalTotal;
    }

    public void setFinalTotal(Double finalTotal) {
        this.finalTotal = finalTotal;
    }
}
