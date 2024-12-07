const express = require("express");
const path = require("path");

const app = express();

// Parsing the body
app.use(express.urlencoded({ extended: true }));

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// // Routing
app.get("/", (req, res, next) => {
  //   res.send("Hello");
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/users", (req, res, next) => {
  res.sendFile(path.join(__dirname, "views", "users.html"));
});

app.listen(3000);
