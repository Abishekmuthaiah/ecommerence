package com.ecommerce.product.controller;

import com.ecommerce.product.dto.ProductRequest;
import com.ecommerce.product.dto.StockCheckResponse;
import com.ecommerce.product.model.Product;
import com.ecommerce.product.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * GET /api/products
     * Returns list of all products, optionally filtered by category or search query
     */
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(productService.searchProducts(search));
        }
        if (category != null && !category.trim().isEmpty()) {
            return ResponseEntity.ok(productService.getProductsByCategory(category));
        }
        return ResponseEntity.ok(productService.getAllProducts());
    }

    /**
     * GET /api/products/{id}
     * Returns a single product by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(null));
    }

    /**
     * GET /api/products/search?name=laptop
     * Searches products by name or description
     */
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProductsByName(@RequestParam(name = "name", required = false) String name) {
        return ResponseEntity.ok(productService.searchProducts(name));
    }

    /**
     * GET /api/products/categories
     * Returns list of all unique categories
     */
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(productService.getAllCategories());
    }

    /**
     * POST /api/products
     * Creates a new product
     */
    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @RequestBody ProductRequest request) {
        Product created = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PUT /api/products/{id}
     * Updates an existing product
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return productService.updateProduct(id, request)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * DELETE /api/products/{id}
     * Deletes a product by ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable Long id) {
        boolean deleted = productService.deleteProduct(id);
        if (deleted) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Product deleted successfully", "id", id));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("success", false, "message", "Product not found", "id", id));
    }

    /**
     * POST /api/products/{id}/check-stock?quantity=1
     * Checks if requested quantity is in stock
     */
    @RequestMapping(value = "/{id}/check-stock", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<StockCheckResponse> checkStock(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") int quantity) {
        StockCheckResponse response = productService.checkStock(id, quantity);
        return ResponseEntity.ok(response);
    }

    /**
     * PUT /api/products/{id}/stock?quantity=1 (or deduct=1)
     * Deducts stock when an order is placed
     */
    @PutMapping("/{id}/stock")
    public ResponseEntity<?> updateStock(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "1") int quantity,
            @RequestParam(required = false) Integer newStock) {
        try {
            if (newStock != null) {
                return productService.setStock(id, newStock)
                        .map(ResponseEntity::ok)
                        .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
            }
            return productService.updateStock(id, quantity)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }
}
