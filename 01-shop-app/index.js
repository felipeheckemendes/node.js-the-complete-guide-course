const express = require("express");
const path = require("path");

const errorsController = require("./controllers/errors.js");
const adminRoutes = require("./routes/admin.js");
const shopRoutes = require("./routes/shop.js");

const app = express();

// Set templating engine
app.set("view engine", "ejs");
app.set("views", "views");

// Parse the request
app.use(express.urlencoded({ extended: true }));
// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
// Pages not routed: ERROR 404
app.use("/", errorsController.get404);

app.listen(3000);
