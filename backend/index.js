import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import mysql from "mysql";
import util from "util";

dotenv.config();

const app = express();

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "marketplace",
  multipleStatements: true,
});
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1); // Exit the process if the connection fails
  }
  console.log("Connected to the MySQL database.");
});
db.query = util.promisify(db.query);
// Middleware
app.use(express.json());
app.use(cors());

// Configure storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage });

// Serve static files
app.use("/uploads", express.static("uploads"));

// Verify database connection
(async () => {
  try {
    await db.query("SELECT 1"); // to test the connection
    console.log("Connected to the MySQL database.");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
})();

// Routes
app.get("/", (req, res) => {
  res.json("Welcome to the Marketplace API");
});

/* ----------------------- Login/Register ----------------------- */

// Register endpoint
app.post("/register", async (req, res) => {
  const { name, email, password, address, birthday } = req.body;

  try {
    // Check if the email already exists
    const emailCheckQuery = "SELECT email FROM users WHERE email = ?";
    db.query(emailCheckQuery, [email], async (err, results) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }

      if (results.length > 0) {
        // Email already exists
        return res
          .status(400)
          .json({ success: false, message: "Email is already registered" });
      }

      // Insert the user into the database
      const insertQuery =
        "INSERT INTO users (email, password, name, address, birthday) VALUES (?, ?, ?, ?, ?)";
      db.query(
        insertQuery,
        [email, password, name, address, birthday],
        (err, result) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ success: false, message: "Registration failed" });
          }
          return res
            .status(200)
            .json({ success: true, message: "User registered successfully" });
        }
      );
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }

  try {
    const users = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "User not found!" });
    }

    const user = users[0];

    // Compare passwords directly (not recommended for production)
    if (password === user.password) {
      return res.status(200).json({
        success: true,
        isAdmin: false,
        name: user.name,
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password!" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

/* ----------------------- CUSTOMER SIDE  ----------------------- */

app.get('/ratings', async (req, res) => {
  const { product_id } = req.query;
  try {
    const ratings = await db.query('SELECT * FROM ratings WHERE product_id = ?', [product_id]);
    res.json({ success: true, ratings });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.json({ success: false, message: 'Error fetching ratings' });
  }
});


//  Insert product into cart
app.post("/cart", async (req, res) => {
  try {
    const { email, prod_name, price, quantity } = req.body; // Only include the relevant fields

    // Log the request body to ensure we are receiving correct data
    console.log("Request body:", req.body);

    // Check if the product already exists in the cart for the given email
    const existingProduct = await db.query(
      "SELECT * FROM cart WHERE email = ? AND prod_name = ?",
      [email, prod_name]
    );

    if (existingProduct.length > 0) {
      // If the product exists, update the quantity
      const newQuantity = existingProduct[0].quantity + quantity;
      const updateResult = await db.query(
        "UPDATE cart SET quantity = ? WHERE email = ? AND prod_name = ?",
        [newQuantity, email, prod_name]
      );
      console.log("Quantity updated:", updateResult);
    } else {
      // If the product does not exist, insert a new product
      const insertResult = await db.query(
        "INSERT INTO cart (email, prod_name, price, quantity) VALUES (?, ?, ?, ?)",
        [email, prod_name, price, quantity]
      );
      console.log("Product added to cart:", insertResult);
    }

    res.json({ success: true, message: "Cart updated successfully" });
  } catch (error) {
    console.error("Cart operation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update cart",
      error: error.message,
    });
  }
});

app.get("/cart/:email", async (req, res) => {
  const email = req.params.email;

  console.log("Email parameter received:", email);

  try {
    // Use a JOIN query to fetch cart details along with product images
    const query = `
      SELECT
        c.cart_id,
        c.prod_name,
        c.quantity,
        c.price,
        b.image
      FROM cart c
      JOIN bags_tbl b ON c.prod_name = b.prod_name
      WHERE c.email = ?;
    `;

    const rows = await db.query(query, [email]);

    // Check and log the response type
    console.log("Rows fetched:", rows);

    // If the rows are returned as an array inside an array, unpack them
    const result = Array.isArray(rows[0]) ? rows[0] : rows;

    res.json({
      success: true,
      data: result, // Return rows directly
    });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart items",
      error: error.message,
    });
  }
});

app.post("/checkout", async (req, res) => {
  try {
    const { email, selectedItems } = req.body;

    if (!selectedItems || selectedItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items selected for checkout",
      });
    }

    // First verify the items exist in cart and check stock
    const cartQuery = `
      SELECT c.*, b.stock 
      FROM cart c
      JOIN bags_tbl b ON c.prod_name = b.prod_name 
      WHERE c.email = ? AND c.prod_name IN (?)
    `;

    const cartItems = await db.query(cartQuery, [email, selectedItems]);

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Selected items not found in cart",
      });
    }

    // Check stock availability
    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for: ${item.prod_name}`,
        });
      }
    }

    // Get user address
    const userQuery = "SELECT address FROM users WHERE email = ?";
    const users = await db.query(userQuery, [email]);

    if (!users || users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Calculate total
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create order
    const createOrderQuery = `
      INSERT INTO orders (email, address, total_price) 
      VALUES (?, ?, ?)
    `;

    const orderResult = await db.query(createOrderQuery, [
      email,
      users[0].address,
      totalPrice,
    ]);

    const orderId = orderResult.insertId;

    // Add order items
    for (const item of cartItems) {
      await db.query(
        "INSERT INTO order_items (order_id, prod_name, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.prod_name, item.quantity, item.price]
      );

      // Update stock
      await db.query(
        "UPDATE bags_tbl SET stock = stock - ? WHERE prod_name = ?",
        [item.quantity, item.prod_name]
      );
    }

    // Remove from cart
    await db.query("DELETE FROM cart WHERE email = ? AND prod_name IN (?)", [
      email,
      selectedItems,
    ]);

    res.json({
      success: true,
      message: "Order placed successfully",
      orderId: orderId,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process checkout",
      error: error.message,
    });
  }
});

// Get user profile by email
app.get("/users", async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  try {
    const query =
      "SELECT name, email, address, birthday FROM users WHERE email = ?";
    const user = await db.query(query, [email]);

    if (user.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json(user[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch user data" });
  }
});

// Update user profile
app.put("/users/update", async (req, res) => {
  const { email, name, address, birthday } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  try {
    const query = `
      UPDATE users 
      SET name = ?, address = ?, birthday = ?
      WHERE email = ?
    `;

    await db.query(query, [name, address, birthday, email]);

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update profile" });
  }
});

// Update user password
app.put("/users/password", async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Email, current password, and new password are required",
    });
  }

  try {
    // First verify current password
    const user = await db.query("SELECT password FROM users WHERE email = ?", [
      email,
    ]);

    if (user.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user[0].password !== currentPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Current password is incorrect" });
    }

    // Update password
    await db.query("UPDATE users SET password = ? WHERE email = ?", [
      newPassword,
      email,
    ]);

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update password" });
  }
});

app.delete("/cart/:prod_name", async (req, res) => {
  const cartId = req.params.prod_name;

  try {
    const result = await db.query("DELETE FROM cart WHERE prod_name = ?", [
      cartId,
    ]);
    console.log("Cart item deleted:", result);
    res.json({ success: true, message: "Cart item deleted successfully" });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete cart item",
      error: error.message,
    });
  }
});

app.patch("/cart/increment", async (req, res) => {
  const { prod_name, email } = req.body; // Accept prod_name and email from the request body

  console.log("Increment request:", req.body);

  if (!prod_name || !email) {
    return res
      .status(400)
      .json({ success: false, message: "Product name and email are required" });
  }

  try {
    // SQL query to update the cart item quantity by incrementing it
    const query = `
      UPDATE cart
      SET quantity = quantity + 1
      WHERE prod_name = ? AND email = ?
      AND quantity < (SELECT stock FROM bags_tbl WHERE prod_name = ?)
    `;

    // Execute the query
    const result = await db.query(query, [prod_name, email, prod_name]);

    // Check if the update affected any rows
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found or user does not have this product",
      });
    }

    // Return the success message after updating the quantity
    res.status(200).json({
      success: true,
      message: "Product quantity updated successfully",
    });
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product quantity",
      error: error.message,
    });
  }
});

// Decrement product quantity by prod_name and email
app.patch("/cart/decrement", async (req, res) => {
  const { prod_name, email } = req.body; // Accept prod_name and email from the request body

  console.log("Decrement request:", req.body);

  if (!prod_name || !email) {
    return res
      .status(400)
      .json({ success: false, message: "Product name and email are required" });
  }

  try {
    // SQL query to update the cart item quantity by decrementing it
    const query = `
      UPDATE cart
      SET quantity = quantity - 1
      WHERE prod_name = ? AND email = ?
      AND quantity > 1
    `;

    // Execute the query
    const result = await db.query(query, [prod_name, email]);

    // Check if the update affected any rows
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found, user does not have this product, or quantity is already 1",
      });
    }

    // Return the success message after decrementing the quantity
    res.status(200).json({
      success: true,
      message: "Product quantity decremented successfully",
    });
  } catch (error) {
    console.error("Error decrementing quantity:", error);
    res.status(500).json({
      success: false,
      message: "Failed to decrement product quantity",
      error: error.message,
    });
  }
});

// Get orders by user email
app.get("/orders", async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required to fetch orders",
    });
  }

  try {
    // First, get the basic order information
    const orderQuery = `
      SELECT 
        o.order_id,
        o.total_price,
        o.address,
        o.order_status,
        o.email,
        u.name as customer_name
      FROM orders o
      JOIN users u ON o.email = u.email
      WHERE o.email = ?
    `;

    const orders = await db.query(orderQuery, [email]);

    // If no orders found, return empty array
    if (!orders || orders.length === 0) {
      return res.json({
        success: true,
        data: [],
      });
    }

    // For each order, get its items
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const itemsQuery = `
          SELECT prod_name, quantity, price
          FROM order_items
          WHERE order_id = ?
        `;
        const items = await db.query(itemsQuery, [order.order_id]);

        return {
          orderId: order.order_id,
          totalPrice: order.total_price,
          address: order.address,
          orderStatus: order.order_status || "Pending",
          customerName: order.customer_name,
          purchases: items.map((item) => item.prod_name),
        };
      })
    );

    res.json({
      success: true,
      data: ordersWithItems,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

app.post("/submit_review", (req, res) => {
  console.log(req.body); // Log the incoming request body

  const { orderId, bagId, rating, comment } = req.body;

  // Convert rating to integer
  const ratingInt = parseInt(rating, 10);

  // Check if the required fields are present and the rating is a valid integer within range
  if (
    !orderId ||
    !bagId ||
    isNaN(ratingInt) ||
    ratingInt < 1 ||
    ratingInt > 5 ||
    !comment
  ) {
    return res
      .status(400)
      .json({ error: "Missing required fields or invalid rating" });
  }

  const query =
    "INSERT INTO ratings (`order_id`, `product_id`, `rating`, `comment`) VALUES (?)";
  const values = [orderId, bagId, ratingInt, comment];

  db.query(query, [values], (err, data) => {
    if (err) {
      console.error("Error inserting review:", err);
      return res.status(500).json({ error: "Failed to insert review" });
    }

    return res.json({ message: "Review submitted successfully!" });
  });
});

/* ----------------------- ADMIN SIDE ----------------------- */

app.get("/bags_tbl", (req, res) => {
  const q = "SELECT * FROM bags_tbl";
  db.query(q, (err, data) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.json(err);
    }
    const processedData = data.map((bag) => ({
      ...bag,
      image: bag.image.startsWith("/uploads/")
        ? `http://localhost:8800${bag.image}`
        : bag.image,
    }));
    return res.json(data);
  });
});

app.post("/bags_tbl", (req, res) => {
  const q =
    "INSERT INTO bags_tbl (`prod_name`, `prod_desc`, `image`, `price`, `stock`) VALUES (?)";
  const values = [
    req.body.prod_name,
    req.body.prod_desc,
    `${req.body.image}`,
    req.body.price,
    req.body.stock_no,
  ];
  db.query(q, [values], (err, data) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ error: "Failed to insert data" });
    }
    return res.json("Successfully added to the database!");
  });
});

// Get a specific bag by ID
app.get("/bags_tbl/:id", (req, res) => {
  const bagId = req.params.id;
  const q = "SELECT * FROM bags_tbl WHERE id = ?";
  db.query(q, [bagId], (err, data) => {
    if (err) {
      console.error("Error fetching bag:", err);
      return res.status(500).json({ error: "Failed to fetch bag" });
    }

    if (data.length === 0) {
      return res.status(404).json({ message: "Bag not found" });
    }

    const bag = data[0];
    const processedBag = {
      ...bag,
      image: bag.image.startsWith("/uploads/")
        ? `http://localhost:8800${bag.image}`
        : bag.image,
    };

    return res.json(processedBag);
  });
});

app.delete("/bags_tbl/:id", (req, res) => {
  const bagId = req.params.id;
  const q = "DELETE FROM bags_tbl WHERE id = ?";
  db.query(q, [bagId], (err, data) => {
    if (err) {
      console.error("Error deleting bag:", err);
      return res.json(err);
    }
    return res.json("Bag deleted successfully!");
  });
});

app.put("/bags_tbl/:id", (req, res) => {
  const bagId = req.params.id;
  const q =
    "UPDATE bags_tbl SET `prod_name` = ?, `prod_desc` = ?, `price` = ?, `image` = ?, `stock` = ? WHERE id = ?";
  const values = [
    req.body.prod_name,
    req.body.prod_desc,
    req.body.price,
    req.body.image.includes("/uploads/")
      ? req.body.image
      : `/uploads/${req.body.image}`,
    req.body.stock,
  ];

  db.query(q, [...values, bagId], (err, data) => {
    if (err) {
      console.error("Error updating bag:", err);
      return res.json(err);
    }
    return res.json("Bag updated successfully!");
  });
});

// Get all orders
app.get("/all_orders", async (req, res) => {
  try {
    // Query to fetch basic order details
    const orderQuery = `
      SELECT 
        o.order_id,
        o.email,
        o.address,
        o.total_price,
        o.order_status,
        u.name AS customer_name
      FROM orders o
      JOIN users u ON o.email = u.email
    `;

    const orders = await db.query(orderQuery);

    if (!orders.length) {
      return res.json({
        success: true,
        data: [],
      });
    }

    // Fetch items for each order and include them in the response
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const itemsQuery = `
          SELECT 
            prod_name, 
            quantity, 
            price 
          FROM order_items 
          WHERE order_id = ?
        `;
        const items = await db.query(itemsQuery, [order.order_id]);

        return {
          orderId: order.order_id,
          totalPrice: order.total_price,
          address: order.address,
          orderStatus: order.order_status || "Pending",
          customerName: order.customer_name,
          email: order.email,
          items,
        };
      })
    );

    res.json({
      success: true,
      data: ordersWithItems,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

app.put("/update_order_status", async (req, res) => {
  const { orderId, status } = req.body;

  if (!orderId || !status) {
    return res.status(400).json({
      success: false,
      message: "Order ID and status are required",
    });
  }

  try {
    const query = "UPDATE orders SET order_status = ? WHERE order_id = ?";
    const result = await db.query(query, [status, orderId]);

    console.log("Query result:", result);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
});

//image
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// Start the server
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
