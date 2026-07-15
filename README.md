The System won't work without a database

The Database Blueprint :

CREATE DATABASE stock_db;

USE stock_db;

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL
);
