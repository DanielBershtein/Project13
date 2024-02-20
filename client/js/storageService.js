"use strict";

const USER_KEY = "loggedInUser";
const PRODUCT_KEY = "products";
const USER_PRODUCT_KEY = "userProducts";

const storageService = {
  getProducts() {
    const products = JSON.parse(localStorage.getItem(PRODUCT_KEY));
    return products || [];
  },
  getOneProduct(productId) {
    const products = this.getProducts();

    const productById = products.find((product) => product._id === productId);

    return productById;
  },
  getOneUserProduct(productId) {
    const products = this.getUserProducts();
    const productById = products.find((product) => product._id === productId);

    return productById;
  },
  updateProductQnt(productId, num) {
    const products = this.getProducts();
    console.log(products);

    const updatedProducts = products.map((product) => {
      if (product._id === productId) {
        product.quantity = product.quantity + num;
      }
      return product;
    });
    console.log(updatedProducts);
    this.setProducts(updatedProducts);

    const userProducts = this.getUserProducts();
    console.log(userProducts);

    const updatedUserProducts = userProducts.map((product) => {
      if (product._id === productId) {
        product.quantity = product.quantity + num;
      }
      return product;
    });
    console.log(updatedUserProducts);
    this.setUserProducts(updatedUserProducts);
  },
  getUserProducts() {
    const products = JSON.parse(localStorage.getItem(USER_PRODUCT_KEY));
    return products || [];
  },
  setProducts(products) {
    localStorage.setItem(PRODUCT_KEY, JSON.stringify(products));
  },
  setUserProducts(products) {
    const userProducts = localStorage.setItem(
      USER_PRODUCT_KEY,
      JSON.stringify(products)
    );
  },
  getUser() {
    const user = JSON.parse(localStorage.getItem(USER_KEY));
    return user || null;
  },
  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearAll() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(PRODUCT_KEY);
    localStorage.removeItem(USER_PRODUCT_KEY);
    localStorage.removeItem("totalPrice");
    localStorage.removeItem("orders");
  },
  toggleDone(productId) {
    const products = this.getProducts();
    const updatedProducts = products.map((product) => {
      if (product._id === productId) {
        product.isDone = !product.isDone;
      }
      return product;
    });
    this.setProducts(updatedProducts);
  },
  updateOneProduct(newProduct, num) {
    const products = this.getUserProducts();

    const filteredProduct = products.filter(
      (product) => newProduct.name === product.name
    );

    if (filteredProduct.length === 0) {
      newProduct.amount = 1;
      products.push(newProduct);
    } else {
      let index = filteredProduct.findIndex(
        (product) => product.name === newProduct.name
      );
      filteredProduct[index].amount = filteredProduct[index].amount + num;
    }

    this.setUserProducts(products);
  },
  removeOneUserProduct(productId) {
    const products = this.getUserProducts();
    const updatedProducts = products.filter(
      (product) => product._id !== productId
    );
    this.setUserProducts(updatedProducts);
  },
};
