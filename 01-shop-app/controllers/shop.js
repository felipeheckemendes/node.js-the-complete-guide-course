const Product = require("../models/product");

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

exports.getCart = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render("shop/cart.ejs", {
      pageTitle: "Cart",
      path: "/cart",
      products: products,
    });
  });
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
