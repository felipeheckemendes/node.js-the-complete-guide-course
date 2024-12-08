const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getShop = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render("shop/shop.ejs", {
      pageTitle: "Shop",
      path: "/",
      products: products,
    });
  });
};

exports.getProducts = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render("shop/product-list.ejs", {
      pageTitle: "Products",
      path: "/product-list",
      products: products,
    });
  });
};

exports.getProductDetails = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId, (product) => {
    console.log(product);
    res.render("shop/product-detail.ejs", {
      pageTitle: product.title,
      path: "/product/detail",
      product: product,
    });
  });
};

exports.getCart = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render("shop/cart.ejs", {
      pageTitle: "Cart",
      path: "/cart",
      products: products,
    });
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  console.log("Product to be added to cart", productId);
  res.redirect("/cart");
};

exports.getOrders = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render("shop/orders.ejs", {
      pageTitle: "Orders",
      path: "/orders",
      products: products,
    });
  });
};

exports.getCheckout = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render("shop/checkout.ejs", {
      pageTitle: "Cart",
      path: "/checkout",
      products: products,
    });
  });
};
