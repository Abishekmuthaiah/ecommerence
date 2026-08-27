package com.ecommerce.product.config;

import com.ecommerce.product.model.Product;
import com.ecommerce.product.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;

    public DataInitializer(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() == 0) {
            List<Product> initialProducts = List.of(
                new Product(
                    "HP Pavilion 15 Gaming Laptop",
                    "Intel Core i7 13th Gen, 16GB DDR5 RAM, 1TB NVMe SSD, NVIDIA RTX 4060 8GB Graphics, 144Hz FHD IPS Display, Backlit RGB Keyboard.",
                    55000.0,
                    "Electronics",
                    15,
                    "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
                    4.8,
                    42
                ),
                new Product(
                    "Logitech MX Master 3S Wireless Mouse",
                    "Quiet clicks, 8K DPI any-surface tracking, MagSpeed electromagnetic scrolling, USB-C quick recharge, Bluetooth & Bolt receiver.",
                    800.0,
                    "Accessories",
                    35,
                    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
                    4.9,
                    128
                ),
                new Product(
                    "Samsung Galaxy S24 Ultra 5G",
                    "200MP Quad Camera with AI Nightography, Snapdragon 8 Gen 3 Processor, Dynamic AMOLED 2X 120Hz Display, S-Pen included, Titanium Gray.",
                    25000.0,
                    "Electronics",
                    20,
                    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80",
                    4.7,
                    85
                ),
                new Product(
                    "Sony WH-1000XM5 Noise-Canceling Headphones",
                    "Industry-leading active noise cancellation with 8 microphones, 30-hour battery life, speak-to-chat technology, crystal clear hands-free calling.",
                    1500.0,
                    "Audio",
                    25,
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
                    4.9,
                    210
                ),
                new Product(
                    "Apple Watch Series 9 GPS",
                    "Advanced health sensors, ECG, Crash Detection, brighter Always-On Retina display, S9 SiP chip, double tap gesture, Midnight Aluminum Case.",
                    12000.0,
                    "Wearables",
                    18,
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
                    4.6,
                    64
                ),
                new Product(
                    "Dell UltraSharp 27 4K Monitor",
                    "IPS Black panel with 2000:1 contrast ratio, 98% DCI-P3 color gamut, USB-C hub with 90W power delivery, height adjustable stand.",
                    28500.0,
                    "Electronics",
                    12,
                    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
                    4.7,
                    33
                ),
                new Product(
                    "Keychron K2 Pro Mechanical Keyboard",
                    "Wireless/Wired custom mechanical keyboard with QMK/VIA support, hot-swappable Gateron G Pro switches, RGB backlighting, Mac & Windows layout.",
                    6500.0,
                    "Accessories",
                    40,
                    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
                    4.8,
                    79
                ),
                new Product(
                    "Bose SoundLink Revolve+ II Bluetooth Speaker",
                    "True 360° sound for consistent, uniform coverage, seamless aluminum body, water and dust resistant (IP55), up to 17 hours battery.",
                    18900.0,
                    "Audio",
                    14,
                    "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
                    4.6,
                    52
                )
            );

            productRepository.saveAll(initialProducts);
        }
    }
}
