const express = require("express");
const path = require("path");

const shopController = require("../controllers/shop.js");
const router = express.Router();

router.get("/", shopController.getShop);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProductDetails);

router.get("/cart", shopController.getCart);

router.post("/cart", shopController.postCart);

router.get("/orders", shopController.getOrders);

router.get("/checkout", shopController.getCheckout);

module.exports = router;
