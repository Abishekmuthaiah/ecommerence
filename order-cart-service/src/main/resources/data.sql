-- Sample Initial Data for order_db
INSERT INTO carts (id, user_id) VALUES (1, 1);
INSERT INTO cart_items (cart_id, product_id, quantity, price, product_name, image_url) VALUES 
(1, 2, 1, 800.0, 'Logitech MX Master 3S Wireless Mouse', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80');

INSERT INTO orders (id, user_id, total_amount, status, customer_name, customer_email, customer_phone, shipping_address, payment_method) VALUES
(1, 1, 26250.0, 'DELIVERED', 'Alex Johnson', 'alex.johnson@example.com', '+91 9876543210', '42 Silicon Avenue, Tech Park, Bangalore 560001', 'UPI / Online');

INSERT INTO order_items (order_id, product_id, quantity, price, product_name, image_url) VALUES
(1, 3, 1, 25000.0, 'Samsung Galaxy S24 Ultra 5G', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80');
