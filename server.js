const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 80;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'miuser',
  password: 'admin123',
  database: 'db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Conectado a MySQL!');
});

// Create tables
const createTableQuery = `
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
`;

db.query(createTableQuery, (err) => {
  if (err) throw err;
});

// Insert sample data
const sampleProducts = [
  ['Laptop Pro', 'Electronics', 15, 1299.99, 'High-performance laptop'],
  ['Wireless Mouse', 'Electronics', 45, 29.99, 'Ergonomic wireless mouse'],
  ['Office Chair', 'Furniture', 8, 199.99, 'Comfortable office chair'],
  ['Coffee Beans', 'Food', 120, 12.99, 'Premium coffee beans'],
  ['Notebook Set', 'Office Supplies', 200, 8.99, 'Pack of 3 notebooks']
];

sampleProducts.forEach(product => {
  db.query(
    'INSERT INTO products (name, category, quantity, price, description) VALUES (?, ?, ?, ?, ?)',
    product,
    (err) => { if (err) console.error(err); }
  );
});

// API Routes
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products ORDER BY created_at DESC', (err, results) => {
    if (err) { res.status(500).json({ error: err.message }); return; }
    res.json(results);
  });
});

app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
    if (err) { res.status(500).json({ error: err.message }); return; }
    if (results.length === 0) { res.status(404).json({ error: 'Product not found' }); return; }
    res.json(results[0]);
  });
});

app.post('/api/products', (req, res) => {
  const { name, category, quantity, price, description } = req.body;
  
  if (!name || !category || quantity === undefined || price === undefined) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  db.query(
    'INSERT INTO products (name, category, quantity, price, description) VALUES (?, ?, ?, ?, ?)',
    [name, category, quantity, price, description],
    (err, results) => {
      if (err) { res.status(500).json({ error: err.message }); return; }
      res.json({ id: results.insertId, message: 'Product created successfully' });
    }
  );
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, category, quantity, price, description } = req.body;

  const query = `
    UPDATE products
    SET name = ?, category = ?, quantity = ?, price = ?, description = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.query(query, [name, category, quantity, price, description, id], (err, results) => {
    if (err) { res.status(500).json({ error: err.message }); return; }
    if (results.affectedRows === 0) { res.status(404).json({ error: 'Product not found' }); return; }
    res.json({ message: 'Product updated successfully' });
  });
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM products WHERE id = ?', [id], (err, results) => {
    if (err) { res.status(500).json({ error: err.message }); return; }
    if (results.affectedRows === 0) { res.status(404).json({ error: 'Product not found' }); return; }
    res.json({ message: 'Product deleted successfully' });
  });
});

app.get('/api/stats', (req, res) => {
  db.query(`
    SELECT 
      COUNT(*) as total_products,
      SUM(quantity) as total_items,
      COUNT(DISTINCT category) as categories,
      SUM(quantity * price) as total_value
    FROM products
  `, (err, results) => {
    if (err) { res.status(500).json({ error: err.message }); return; }
    res.json(results[0]);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
