-- Drop existing tables to avoid conflicts
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS bags_tbl;

-- Create bags_tbl table
CREATE TABLE bags_tbl (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prod_name VARCHAR(255) NOT NULL UNIQUE, -- Ensure prod_name is unique for FK
    prod_desc TEXT NOT NULL,
    image VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL
);

-- Create users table
CREATE TABLE users (
    email VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    birthday DATE NOT NULL
);

-- Create cart table
CREATE TABLE cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    prod_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE,
    FOREIGN KEY (prod_name) REFERENCES bags_tbl(prod_name) ON DELETE CASCADE
);

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    order_status ENUM('Pending', 'Preparing', 'Shipped', 'Delivered') DEFAULT 'Pending',
    FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
);

-- Create order_items table to store the purchased items for each order
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    prod_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (prod_name) REFERENCES bags_tbl(prod_name) ON DELETE CASCADE
);

-- Example procedure to handle the checkout process
DELIMITER $$

CREATE PROCEDURE CheckoutOrder(IN user_email VARCHAR(255))
BEGIN
    DECLARE total DECIMAL(10, 2) DEFAULT 0.0;

    -- Calculate total price of the items in the cart
    SELECT SUM(c.quantity * c.price) INTO total
    FROM cart c
    WHERE c.email = user_email;

    -- Insert a new order
    INSERT INTO orders (email, address, total_price)
    SELECT email, address, total
    FROM users
    WHERE email = user_email;

    -- Get the last inserted order ID
    SET @last_order_id = LAST_INSERT_ID();

    -- Insert order items from the cart
    INSERT INTO order_items (order_id, prod_name, quantity, price)
    SELECT @last_order_id, c.prod_name, c.quantity, c.price
    FROM cart c
    WHERE c.email = user_email;

    -- Update stock in bags_tbl table
    UPDATE bags_tbl p
    JOIN cart c ON p.prod_name = c.prod_name
    SET p.stock = p.stock - c.quantity
    WHERE c.email = user_email;

    -- Clear the user's cart
    DELETE FROM cart WHERE email = user_email;
END$$

DELIMITER ;


-- Create ratings table with order_id and product_id as TEXT
CREATE TABLE ratings (
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5), -- Rating between 1 and 5
    comment TEXT
);



-- Insert sample data into users
INSERT INTO users (email, password, name, address, birthday) 
VALUES ('admin', 'password', 'Admin User', 'Admin Address', '2000-01-01');
