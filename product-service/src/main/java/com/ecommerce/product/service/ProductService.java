package com.ecommerce.product.service;

import com.ecommerce.product.dto.ProductRequest;
import com.ecommerce.product.dto.StockCheckResponse;
import com.ecommerce.product.model.Product;
import com.ecommerce.product.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> searchProducts(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return productRepository.findAll();
        }
        return productRepository.searchProducts(keyword.trim());
    }

    public List<Product> getProductsByCategory(String category) {
        if (category == null || category.trim().equalsIgnoreCase("all")) {
            return productRepository.findAll();
        }
        return productRepository.findByCategoryIgnoreCase(category.trim());
    }

    public List<String> getAllCategories() {
        return productRepository.findDistinctCategories();
    }

    public Product createProduct(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setStock(request.getStock());
        product.setImageUrl(request.getImageUrl());
        return productRepository.save(product);
    }

    public Optional<Product> updateProduct(Long id, ProductRequest request) {
        return productRepository.findById(id).map(existing -> {
            existing.setName(request.getName());
            existing.setDescription(request.getDescription());
            existing.setPrice(request.getPrice());
            existing.setCategory(request.getCategory());
            existing.setStock(request.getStock());
            if (request.getImageUrl() != null && !request.getImageUrl().trim().isEmpty()) {
                existing.setImageUrl(request.getImageUrl());
            }
            return productRepository.save(existing);
        });
    }

    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public StockCheckResponse checkStock(Long id, int requestedQuantity) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isEmpty()) {
            return new StockCheckResponse(id, false, 0, requestedQuantity, "Product not found");
        }
        Product product = productOpt.get();
        boolean available = product.getStock() >= requestedQuantity;
        String message = available ? "Product in stock" : "Insufficient stock (Available: " + product.getStock() + ")";
        return new StockCheckResponse(id, available, product.getStock(), requestedQuantity, message);
    }

    public Optional<Product> updateStock(Long id, int quantityToDeduct) {
        return productRepository.findById(id).map(product -> {
            int newStock = product.getStock() - quantityToDeduct;
            if (newStock < 0) {
                throw new IllegalArgumentException("Cannot reduce stock below zero. Current: " + product.getStock() + ", Requested reduction: " + quantityToDeduct);
            }
            product.setStock(newStock);
            return productRepository.save(product);
        });
    }

    public Optional<Product> setStock(Long id, int newStock) {
        return productRepository.findById(id).map(product -> {
            if (newStock < 0) {
                throw new IllegalArgumentException("Stock cannot be negative");
            }
            product.setStock(newStock);
            return productRepository.save(product);
        });
    }
}
