const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "stock_db",
});

db.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:", err.message);
        process.exit(1);
    }
    console.log("Connected to MySQL database.");
});

// GET all products
app.get("/api/products", (req, res) => {
    db.query("SELECT id, name, category, quantity AS stock, price FROM products", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// POST a new product
app.post("/api/products", (req, res) => {
    const { name, category, stock, price } = req.body;
    db.query(
        "INSERT INTO products (name, category, quantity, price) VALUES (?, ?, ?, ?)",
        [name, category, stock, price],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: result.insertId, name, category, stock, price });
        }
    );
});

// PUT (update) a product
app.put("/api/products/:id", (req, res) => {
    const { name, category, stock, price } = req.body;
    db.query(
        "UPDATE products SET name = ?, category = ?, quantity = ?, price = ? WHERE id = ?",
        [name, category, stock, price, req.params.id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ error: "Product not found" });
            res.json({ id: Number(req.params.id), name, category, stock, price });
        }
    );
});

// DELETE a product
app.delete("/api/products/:id", (req, res) => {
    db.query("DELETE FROM products WHERE id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Product not found" });
        res.json({ message: "Product deleted" });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
