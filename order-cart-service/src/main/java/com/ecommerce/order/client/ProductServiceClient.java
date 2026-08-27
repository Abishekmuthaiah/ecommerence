package com.ecommerce.order.client;

import com.ecommerce.order.dto.ProductDto;
import com.ecommerce.order.dto.StockCheckResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Component
public class ProductServiceClient {

    private static final Logger log = LoggerFactory.getLogger(ProductServiceClient.class);

    private final RestTemplate restTemplate;
    private final String productServiceUrl;

    public ProductServiceClient(RestTemplate restTemplate,
                                @Value("${services.product-service.url:http://localhost:8081/api/products}") String productServiceUrl) {
        this.restTemplate = restTemplate;
        this.productServiceUrl = productServiceUrl;
    }

    /**
     * Fetch product details from Product Service
     */
    public Optional<ProductDto> getProductById(Long productId) {
        String url = productServiceUrl + "/" + productId;
        try {
            log.info("Calling Product Service: GET {}", url);
            ProductDto product = restTemplate.getForObject(url, ProductDto.class);
            return Optional.ofNullable(product);
        } catch (HttpClientErrorException.NotFound e) {
            log.warn("Product ID {} not found in Product Service", productId);
            return Optional.empty();
        } catch (RestClientException e) {
            log.error("Failed to connect to Product Service at {}: {}", url, e.getMessage());
            throw new RuntimeException("Product Service is currently unreachable. Please ensure Product Service is running on port 8081.");
        }
    }

    /**
     * Check if product has enough stock
     */
    public StockCheckResponse checkStock(Long productId, int quantity) {
        String url = productServiceUrl + "/" + productId + "/check-stock?quantity=" + quantity;
        try {
            log.info("Calling Product Service: GET {}", url);
            StockCheckResponse response = restTemplate.getForObject(url, StockCheckResponse.class);
            return response != null ? response : new StockCheckResponse(productId, false, 0, quantity, "Empty response from Product Service");
        } catch (RestClientException e) {
            log.error("Failed to check stock from Product Service: {}", e.getMessage());
            throw new RuntimeException("Unable to verify product stock from Product Service. Please ensure Product Service is running on port 8081.");
        }
    }

    /**
     * Deduct stock when an order is shipped
     */
    public boolean reduceStock(Long productId, int quantity) {
        String url = productServiceUrl + "/" + productId + "/stock?quantity=" + quantity;
        try {
            log.info("Calling Product Service: PUT {} to deduct {} units from stock", url, quantity);
            ResponseEntity<Void> response = restTemplate.exchange(url, HttpMethod.PUT, HttpEntity.EMPTY, Void.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (RestClientException e) {
            log.error("Failed to reduce stock in Product Service for product {}: {}", productId, e.getMessage());
            throw new RuntimeException("Failed to deduct inventory in Product Service for product ID: " + productId);
        }
    }

    /**
     * Restore stock if a shipped order is cancelled
     */
    public boolean restoreStock(Long productId, int quantity) {
        String url = productServiceUrl + "/" + productId + "/stock?quantity=" + (-quantity);
        try {
            log.info("Calling Product Service: PUT {} to restore {} units back to stock", url, quantity);
            ResponseEntity<Void> response = restTemplate.exchange(url, HttpMethod.PUT, HttpEntity.EMPTY, Void.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (RestClientException e) {
            log.error("Failed to restore stock in Product Service for product {}: {}", productId, e.getMessage());
            throw new RuntimeException("Failed to restore inventory in Product Service for product ID: " + productId);
        }
    }
}
