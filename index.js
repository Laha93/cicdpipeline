// const express= require("express")
// const app=express();
// const PORT = process.env.PORT || 3000 

// const users =[{id:1,name:"John"},{id:2,name:"ALice"}]
// const orders =[{id:101,name:"Iphone"},{id:102,name:"Laptop"}]

// app.get("/users",(req,res)=>{
//     res.json(users);
// })
// app.get("/orders",(req,res)=>{
//     res.json(orders)
// })
// app.get("/",(req,res)=>{
//     res.json({message:"hello from microservice 1"})
// })

// app.listen(PORT,()=>{
//     console.log(`Server running on port ${PORT}`);
    
// })
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
  { id: 102, userId: 2, product: "Bread", status: "completed", madeBy: "Alice" },
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

// // All Users Who Ordered Route
// app.get("/users-who-ordered", (req, res) => {
//   const usersWhoOrdered = [...new Set(orders.map(order => order.userId))]; // Get unique userIds
//   const result = users.filter(user => usersWhoOrdered.includes(user.id));

//   res.json({
//     columns: ['ID', 'Name', 'Email'],
//     rows: result.map(user => [user.id, user.name, user.email])
//   });
// });

// // All Who Made Bill Route
// app.get("/who-made-bill", (req, res) => {
//   const madeByList = [...new Set(orders.map(order => order.madeBy))]; // Get unique madeBy values
//   const result = madeByList.map(madeBy => ({ madeBy }));

//   res.json({
//     columns: ['Made By'],
//     rows: result.map(entry => [entry.madeBy])
//   });
// });

// // User Order History Route
// app.get("/users/:id/orders", (req, res) => {
//   const { id } = req.params;
//   const user = users.find(u => u.id === parseInt(id));

//   if (!user) {
//     return res.status(404).json({ error: "User not found" });
//   }

//   // Filter orders by userId to show only this user's orders
//   const userOrders = orders.filter(order => order.userId === parseInt(id));

//   // Format the response as a table-like structure
//   const formattedResponse = {
//     columns: ['Order ID', 'Product', 'Status', 'Made By'],
//     rows: userOrders.map(order => [order.id, order.product, order.status, order.madeBy])
//   };

//   res.json(formattedResponse);
// });

// // Show Who Made Bill for a Specific Order Route
// app.get("/orders/:id/made-by", (req, res) => {
//   const { id } = req.params;
//   const order = orders.find(o => o.id === parseInt(id));

//   if (!order) {
//     return res.status(404).json({ error: "Order not found" });
//   }

//   res.json({ madeBy: order.madeBy });
// });

// // Filter Orders by Status Route
// app.get("/orders/status/:status", (req, res) => {
//   const { status } = req.params;
//   const filteredOrders = orders.filter(order => order.status.toLowerCase() === status.toLowerCase());

//   if (filteredOrders.length === 0) {
//     return res.status(404).json({ error: `No orders found with status: ${status}` });
//   }

//   res.json({
//     columns: ['Order ID', 'User ID', 'Product', 'Status', 'Made By'],
//     rows: filteredOrders.map(order => [order.id, order.userId, order.product, order.status, order.madeBy])
//   });
// });

// // What Each User Ordered Route
// app.get("/users/:id/ordered-items", (req, res) => {
//   const { id } = req.params;
//   const userOrders = orders.filter(order => order.userId === parseInt(id));

//   if (userOrders.length === 0) {
//     return res.status(404).json({ error: "No orders found for this user" });
//   }

//   const orderedItems = userOrders.map(order => order.product);

//   res.json({
//     userId: id,
//     orderedItems
//   });
// });

// // Create a new user (POST)
// app.post("/users", express.json(), (req, res) => {
//   const { name, email } = req.body;

//   if (!name || !email) {
//     return res.status(400).json({ error: "Name and Email are required" });
//   }

//   const newUser = {
//     id: users.length + 1, // Incremental ID
//     name,
//     email
//   };

//   users.push(newUser);

//   res.status(201).json(newUser);
// });

// // Create a new order (POST)
// app.post("/orders", express.json(), (req, res) => {
//   const { userId, product, status, madeBy } = req.body;

//   if (!userId || !product || !status || !madeBy) {
//     return res.status(400).json({ error: "UserId, Product, Status, and MadeBy are required" });
//   }

//   const newOrder = {
//     id: orders.length + 1,
//     userId,
//     product,
//     status,
//     madeBy
//   };

//   orders.push(newOrder);

//   res.status(201).json(newOrder);
// });

// // Update an order's status (PUT)
// app.put("/orders/:id", express.json(), (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   const order = orders.find(o => o.id === parseInt(id));

//   if (!order) {
//     return res.status(404).json({ error: "Order not found" });
//   }

//   order.status = status || order.status;

//   res.json(order);
// });

// // Delete a user
// app.delete("/users/:id", (req, res) => {
//   const { id } = req.params;
//   const userIndex = users.findIndex(u => u.id === parseInt(id));

//   if (userIndex === -1) {
//     return res.status(404).json({ error: "User not found" });
//   }

//   users.splice(userIndex, 1);

//   res.status(204).send();
// });

// // Delete an order
// app.delete("/orders/:id", (req, res) => {
//   const { id } = req.params;
//   const orderIndex = orders.findIndex(o => o.id === parseInt(id));

//   if (orderIndex === -1) {
//     return res.status(404).json({ error: "Order not found" });
//   }

//   orders.splice(orderIndex, 1);

//   res.status(204).send();
// });

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
