const express = require("express");
const path = require("path");

const app = express();
const users = [];

// Set rendering/templating engine
app.set("view engine", "ejs");
app.set("views", "views");

// Parse request
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Routing
app.get("/", (req, res, next) => {
  res.render("index.ejs", { pageTitle: "Create new user" });
});

app.post("/", (req, res, next) => {
  users.push(req.body.username);
  res.redirect("/users");
});

app.get("/users", (req, res, next) => {
  res.render("users.ejs", { pageTitle: "Users", users: users });
});

app.listen(3000);
