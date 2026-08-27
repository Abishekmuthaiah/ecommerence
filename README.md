# E-Commerce Website Using Microservices Architecture

A complete, production-grade online shopping platform built using **React.js, Spring Boot, and MySQL / SQL**.

The application demonstrates a decoupled **2-Microservice Architecture** with independent SQL databases and real-time inter-service REST communication for inventory checking and checkout processing.

---

## 1. System Architecture

```text
                    ┌─────────────────────────┐
                    │   REACT.JS FRONTEND     │
                    │   (Port 3000 / Vite)    │
                    │   • Clean Light UI      │
                    │   • Catalog & Search    │
                    │   • Cart & Checkout     │
                    │   • Order History       │
                    │   • Product Management  │
                    └───────────┬─────────────┘
                                │
                     REST APIs  │
              ┌─────────────────┴─────────────────┐
              │                                   │
              ▼                                   ▼
   ┌──────────────────────┐            ┌────────────────────────┐
   │  PRODUCT SERVICE     │            │ ORDER & CART SERVICE   │
   │  (Spring Boot :8081) │◄── REST ───│  (Spring Boot :8082)   │
   │  • Product CRUD      │    API     │  • Shopping Cart       │
   │  • Search & Filter   │            │  • Order Processing    │
   │  • Stock Management  │            │  • Stock Verification  │
   └──────────┬───────────┘            └───────────┬────────────┘
              │                                    │
              ▼                                    ▼
   ┌──────────────────────┐            ┌────────────────────────┐
   │     product_db       │            │        order_db        │
   │   MySQL / H2 SQL     │            │     MySQL / H2 SQL     │
   │   • products table   │            │   • carts, cart_items  │
   │                      │            │   • orders, order_items│
   └──────────────────────┘            └────────────────────────┘
```

---

## 2. Microservices Breakdown

### Microservice 1: Product Service (`product-service` - Port 8081)
* **Description**: Manages all product data, descriptions, categories, search indexing, and real-time inventory levels.
* **Database**: `product_db`
* **REST APIs**:
  | Method | Endpoint | Description |
  | :--- | :--- | :--- |
  | `GET` | `/api/products` | Get all products (with optional search/category) |
  | `GET` | `/api/products/{id}` | Get product details by ID |
  | `GET` | `/api/products/search?name=laptop` | Search products by name/description |
  | `GET` | `/api/products/categories` | List distinct product categories |
  | `POST` | `/api/products` | Create a new product |
  | `PUT` | `/api/products/{id}` | Update product details |
  | `DELETE` | `/api/products/{id}` | Delete a product |
  | `GET/POST` | `/api/products/{id}/check-stock?quantity=1` | Verify if stock is available |
  | `PUT` | `/api/products/{id}/stock?quantity=1` | Deduct stock upon order |

### Microservice 2: Order & Cart Service (`order-cart-service` - Port 8082)
* **Description**: Manages user shopping carts, quantity adjustments, and handles the order checkout flow. Communicates with Product Service via REST to verify product availability and decrease stock.
* **Database**: `order_db`
* **REST APIs**:
  | Method | Endpoint | Description |
  | :--- | :--- | :--- |
  | `GET` | `/api/cart/{userId}` | Get user shopping cart |
  | `POST` | `/api/cart/{userId}/items` | Add product to cart |
  | `PUT` | `/api/cart/{userId}/items/{productId}` | Update quantity in cart |
  | `DELETE` | `/api/cart/{userId}/items/{productId}` | Remove item from cart |
  | `DELETE` | `/api/cart/{userId}` | Clear entire cart |
  | `POST` | `/api/orders` | Place order (verifies & reduces stock on Product Service) |
  | `GET` | `/api/orders/{userId}` | Get order history for a user |
  | `GET` | `/api/orders/details/{orderId}` | Get single order details |
  | `PUT` | `/api/orders/{orderId}/status` | Update order status |

---

## 3. Project Structure

```text
ecommerce/
├── product-service/             # Spring Boot Product Microservice
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/ecommerce/product/
│       │   ├── controller/ProductController.java
│       │   ├── service/ProductService.java
│       │   ├── repository/ProductRepository.java
│       │   ├── model/Product.java
│       │   ├── dto/ProductRequest.java, StockCheckResponse.java
│       │   ├── config/CorsConfig.java, DataInitializer.java
│       │   └── ProductServiceApplication.java
│       └── resources/
│           ├── application.properties
│           ├── schema.sql
│           └── data.sql
│
├── order-cart-service/          # Spring Boot Order & Cart Microservice
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/ecommerce/order/
│       │   ├── controller/CartController.java, OrderController.java
│       │   ├── service/CartService.java, OrderService.java
│       │   ├── client/ProductServiceClient.java (Inter-service REST)
│       │   ├── repository/CartRepository.java, OrderRepository.java, ...
│       │   ├── model/Cart.java, CartItem.java, Order.java, OrderItem.java
│       │   ├── dto/CartResponse.java, OrderRequest.java, OrderResponse.java
│       │   ├── config/CorsConfig.java, RestTemplateConfig.java
│       │   └── OrderCartServiceApplication.java
│       └── resources/
│           ├── application.properties
│           ├── schema.sql
│           └── data.sql
│
├── frontend-react/              # React.js Frontend (Vite + Modern Light UI)
│   ├── src/
│   │   ├── components/Navbar.jsx, ProductCard.jsx, Footer.jsx, Toast.jsx, ArchitectureModal.jsx
│   │   ├── pages/Home.jsx, Products.jsx, ProductDetails.jsx, Cart.jsx, Orders.jsx, AdminProducts.jsx
│   │   ├── services/productService.js, orderService.js, api.js
│   │   ├── context/CartContext.jsx, UserContext.jsx
│   │   ├── App.jsx, index.jsx, index.css, App.css
│   │   └── package.json
│
├── start-all.bat                # Single-click launcher for all services
├── run-product-service.bat      # Launcher for Product Service
├── run-order-cart-service.bat   # Launcher for Order Service
└── run-frontend.bat             # Launcher for React UI
```

---

## 4. How to Run the Application

### Option A: One-Click Launcher (Windows)
Double-click `start-all.bat` or run:
```cmd
start-all.bat
```

### Option B: Running Services Individually

1. **Start Product Microservice (Port 8081)**:
   ```cmd
   cd product-service
   ..\tools\apache-maven-3.9.9\bin\mvn spring-boot:run
   ```

2. **Start Order & Cart Microservice (Port 8082)**:
   ```cmd
   cd order-cart-service
   ..\tools\apache-maven-3.9.9\bin\mvn spring-boot:run
   ```

3. **Start React Frontend (Port 3000)**:
   ```cmd
   cd frontend-react
   npm run dev
   ```

Visit the application at: **`http://localhost:3000`**

---

## 5. MySQL Configuration (Optional)

By default, both microservices include pre-configured SQL persistence that works out-of-the-box. To connect to an external MySQL instance:

1. Create the databases:
   ```sql
   CREATE DATABASE product_db;
   CREATE DATABASE order_db;
   ```
2. Run microservices with the MySQL profile:
   ```cmd
   mvn spring-boot:run -Dspring-boot.run.profiles=mysql
   ```
"# ecommerence" 
