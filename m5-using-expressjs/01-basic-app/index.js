const express = require("express");
const path = require("path");

const adminRoutes = require("./routes/admin.js");
const shopRoutes = require("./routes/shop.js");

const app = express();

// Parse the request
app.use(express.urlencoded({ extended: true }));
// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);

// Pages not routed: ERROR 404
app.use("/", (req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "./", "views", "404.html"));
});

app.listen(3000);
