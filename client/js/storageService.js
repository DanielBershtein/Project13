"use strict";

const USER_KEY = "loggedInUser";
const PRODUCT_KEY = "products";
const USER_PRODUCT_KEY = "userProducts";

const storageService = {
  getProducts() {
    const products = JSON.parse(localStorage.getItem(PRODUCT_KEY));
    console.log(products);
    console.log(typeof products);

    return products || [];
  },
  getOneProduct(productId) {
    const products = this.getProducts();
    console.log(products);

    const productById = products.filter((product) => {
      if (product._id === productId) {
        return product;
      }
    });
    console.log(productById);

    return productById;
  },
  getUserProducts() {
    const products = JSON.parse(localStorage.getItem(USER_PRODUCT_KEY));
    return products || [];
  },
  setProducts(products) {
    localStorage.setItem(PRODUCT_KEY, JSON.stringify(products));
  },
  setUserProducts(products) {
    console.log(products);

    const userProducts = localStorage.setItem(
      USER_PRODUCT_KEY,
      JSON.stringify(products)
    );
    console.log(userProducts);

    return userProducts || [];
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
  addOneProduct(newProduct) {
    const products = this.getUserProducts();
    console.log(products);

    products.push(newProduct);
    console.log(products);
    this.setUserProducts(products);
  },
  removeOneProduct(productId) {
    const products = this.getUserProducts();
    const updatedProducts = products.filter(
      (product) => product._id !== productId
    );
    this.setUserProducts(updatedProducts);
  },
};
