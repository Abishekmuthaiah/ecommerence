package com.ecommerce.order.dto;

public class OrderItemDto {
    private Long productId;
    private Integer quantity;
    private Double price;
    private String productName;
    private String imageUrl;

    public OrderItemDto() {
    }

    public OrderItemDto(Long productId, Integer quantity, Double price, String productName, String imageUrl) {
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
        this.productName = productName;
        this.imageUrl = imageUrl;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
