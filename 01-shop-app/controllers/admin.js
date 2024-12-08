const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product.ejs", {
    pageTitle: "Add New Product",
    path: "/admin/add-product",
    editing: false,
    product: {},
  });
};

exports.getAdminProducts = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render("admin/products.ejs", {
      pageTitle: "Admin Products",
      path: "/admin/products",
      products: products,
    });
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode == "true") {
    console.log("Not on edit mode, redirecting to index");
    return res.redirect("/");
  }

  const productId = req.params.productId;
  Product.findById(productId, (product) => {
    if (!product) {
      console.log("Product not found, redirecting to index");
      return res.redirect("/");
    }
    console.log("Product found for edit", product);
    res.render("admin/edit-product.ejs", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
      productId: productId,
    });
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(title, imageUrl, price, description);
  product.save();
  res.redirect("/");
};

exports.postEditProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const productId = req.body.productId;

  Product.updateProduct(productId, {
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
  });
  res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteProduct(productId);
  res.redirect("/admin/products");
};
