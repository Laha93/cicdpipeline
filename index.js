const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Sample Data
const users = [
  { id: 1, name: "John", email: "john@example.com" },
  { id: 2, name: "Alice", email: "alice@example.com" }
];

const orders = [
  { id: 101, userId: 1, product: "Cake", status: "pending", madeBy: "John" },
  { id: 102, userId: 2, product: "Bread", status: "completed", madeBy: "Elsa" },
  { id: 103, userId: 1, product: "Cookies", status: "completed", madeBy: "John" },
  { id: 104, userId: 1, product: "Croissant", status: "pending", madeBy: "Alice" }
];

const products = [
  { id: 1, name: "Cake", price: 10 },
  { id: 2, name: "Bread", price: 5 },
  { id: 3, name: "Cookies", price: 7 },
  { id: 4, name: "Croissant", price: 3 }
];

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Baker's Store Microservice!" });
});

// All Users Route
app.get("/users", (req, res) => {
  res.json({
    columns: ['ID', 'Name', 'Email'],
    rows: users.map(user => [user.id, user.name, user.email])
  });
});

// All Orders Route
app.get("/orders", (req, res) => {
  const { status, userId, madeBy } = req.query;

  let filteredOrders = orders;

  // Filter by order status
  if (status) {
    filteredOrders = filteredOrders.filter(order => order.status.toLowerCase() === status.toLowerCase());
  }

  // Filter by userId (the customer placing the order)
  if (userId) {
    filteredOrders = filteredOrders.filter(order => order.userId === parseInt(userId));
  }

  // Filter by who made the bill (baker or cashier)
  if (madeBy) {
    filteredOrders = filteredOrders.filter(order => order.madeBy.toLowerCase() === madeBy.toLowerCase());
  }

  // Format the response as a table-like structure
  const formattedResponse = {
    columns: ['Order ID', 'User ID', 'Product', 'Status', 'Made By'],
    rows: filteredOrders.map(order => [order.id, order.userId, order.product, order.status, order.madeBy])
  };

  res.json(formattedResponse);
});

// All Products Catalogue Route
app.get("/products", (req, res) => {
  res.json({
    columns: ['Product ID', 'Product Name', 'Price'],
    rows: products.map(product => [product.id, product.name, product.price])
  });
});

// All Users Who Ordered Route
app.get("/users-who-ordered", (req, res) => {
  const usersWhoOrdered = [...new Set(orders.map(order => order.userId))]; // Get unique userIds
  const result = users.filter(user => usersWhoOrdered.includes(user.id));

  res.json({
    columns: ['ID', 'Name', 'Email'],
    rows: result.map(user => [user.id, user.name, user.email])
  });
});

// // All Who Made Bill Route
app.get("/who-made-bill", (req, res) => {
  const madeByList = [...new Set(orders.map(order => order.madeBy))]; // Get unique madeBy values
  const result = madeByList.map(madeBy => ({ madeBy }));

  res.json({
    columns: ['Made By'],
    rows: result.map(entry => [entry.madeBy])
  });
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
