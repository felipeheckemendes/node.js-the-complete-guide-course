const express = require("express");
const path = require("path");

const adminController = require("../controllers/admin.js");
const router = express.Router();

router.get("/add-product", adminController.getAddProduct);

router.post("/add-product", adminController.postAddProduct);

router.get("/products", adminController.getAdminProducts);

// module.exports = router;
module.exports = router;
