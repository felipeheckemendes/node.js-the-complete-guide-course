const express = require("express");
const path = require("path");

const router = express.Router();
const rootDir = require("../util/path");
const adminData = require("./admin.js");

router.get("/", (req, res, next) => {
  console.log("shop.js", adminData.products);
  res.render("shop", {
    pageTitle: "Shop",
    products: adminData.products,
    path: "/",
  });
});

module.exports = router;
