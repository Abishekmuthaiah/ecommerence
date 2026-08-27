package com.ecommerce.product.dto;

public class StockCheckResponse {
    private Long productId;
    private boolean available;
    private int currentStock;
    private int requestedQuantity;
    private String message;

    public StockCheckResponse() {
    }

    public StockCheckResponse(Long productId, boolean available, int currentStock, int requestedQuantity, String message) {
        this.productId = productId;
        this.available = available;
        this.currentStock = currentStock;
        this.requestedQuantity = requestedQuantity;
        this.message = message;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public int getCurrentStock() {
        return currentStock;
    }

    public void setCurrentStock(int currentStock) {
        this.currentStock = currentStock;
    }

    public int getRequestedQuantity() {
        return requestedQuantity;
    }

    public void setRequestedQuantity(int requestedQuantity) {
        this.requestedQuantity = requestedQuantity;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
