-- Database: product_db
CREATE DATABASE IF NOT EXISTS product_db;
USE product_db;

CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DOUBLE NOT NULL,
    category VARCHAR(100) NOT NULL,
    stock INT NOT NULL,
    image_url VARCHAR(1000),
    rating DOUBLE DEFAULT 4.5,
    num_reviews INT DEFAULT 10
);
