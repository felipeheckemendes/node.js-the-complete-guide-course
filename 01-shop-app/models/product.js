const fs = require("fs");
const path = require("path");

const filePath = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);
const getProductsFromFile = (callBack) => {
  fs.readFile(filePath, (err, fileContent) => {
    if (err) {
      callBack([]);
    }
    callBack(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    this.id = Math.floor(Math.random() * 10001).toString();
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(filePath, JSON.stringify(products), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }

  static fetchAll(callBack) {
    getProductsFromFile(callBack);
  }

  static findById(id, callBack) {
    getProductsFromFile((products) => {
      const product = products.find((product) => product.id === id);
      callBack(product);
    });
  }

  static updateProduct(id, newProduct, callBack) {
    fs.readFile(filePath, (err, fileContent) => {
      if (err) {
        console.log(err);
      } else {
        console.log(fileContent);
        const products = JSON.parse(fileContent);
        const productIndex = products.findIndex((product) => product.id === id);
        products[productIndex].title = newProduct.title;
        products[productIndex].imageUrl = newProduct.imageUrl;
        products[productIndex].price = newProduct.price;
        products[productIndex].description = newProduct.description;
        fs.writeFile(filePath, JSON.stringify(products), (err) => {
          if (err) {
            console.log("Error writing to file for updating product", err);
          }
        });
      }
    });
  }

  static deleteProduct(id) {
    fs.readFile(filePath, (err, fileContent) => {
      if (err) {
        console.log(err);
      } else {
        console.log(fileContent);
        const products = JSON.parse(fileContent);
        const productIndex = products.findIndex((product) => product.id === id);
        products.splice(productIndex, 1);
        fs.writeFile(filePath, JSON.stringify(products), (err) => {
          if (err) {
            console.log("Error writing to file for updating product", err);
          }
        });
      }
    });
  }
};
