//! --------------------------------------- Sign In Page --------------------------------------
async function signinClick() {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
      return;
    }
    const credentials = { email, password };

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();

    if (!data.success) {
      alert(data.message);
      return;
    }
    const loggedInUser = data.user;
    storageService.setUser(loggedInUser);
    window.location.href = "/products.html";
  } catch (error) {
    console.log(error);
    alert(error.message);
  }
}
//! -----------------------------------Sign Up Page --------------------------------------------
async function signupClick(event) {
  try {
    event.preventDefault();
    const username = document.getElementById("name").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    if (username === "" || password === "" || email === "") {
      alert("Something went wrong!😓");
      return;
    }
    const credentials = {
      username,
      password,
      email,
    };
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();

    window.location.href = "main.html";
  } catch (error) {
    console.log(error);
  }
}

//! ------------------------------------------ Products Page ----------------------------------
function logout() {
  storageService.clearAll();
  window.location.href = "main.html";
}

async function init() {
  const user = storageService.getUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  const products = storageService.getProducts();
  if (products.length === 0) {
    const response = await fetch("/api/products");
    const data = await response.json();
    storageService.setProducts(data);
    renderProducts(data);
    return;
  }

  const productsMap = products.map((itemProduct) => {
    if (itemProduct.quantity === 0) {
      itemProduct.isAvailable = false;
    }
    return itemProduct;
  });

  storageService.setProducts(productsMap);
  renderProducts(productsMap);

  const userProducts = storageService.getUserProducts();
  if (userProducts.length > 0) {
    renderCart(userProducts);
  }
}

function renderProducts(products) {
  const htmlProducts = products.map((product) => {
    const textContent = product.isAvailable ? "Available" : "Not Available";
    const classNames = product.isAvailable
      ? "available-product"
      : "not-available-product";
    const btnId = product._id;
    let addBtn = `<button class="add-to-cart-btn" onclick="addToCart('${btnId}')">Add</button>`;
    let productItem = `
      <tr>
      <td class="name-td-table">${product.name}</td>
      <td class="price-td-table">${product.price}</td>
      <td class="${classNames} avail-td-table">${textContent}</td>
      <td class="add-to-cart-table">${
        product.quantity === 0 ? "Out Of Stock" : addBtn
      }</td>
      </tr>
      `;
    return productItem;
  });

  document.querySelector(".shopTable").innerHTML = htmlProducts.join("");
}

function filterByPrice(arr) {
  let sortedArr = arr.sort((a, b) => a.price - b.price);
  return sortedArr;
}

function filterByName(arr) {
  let sortedArr = arr.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    return 0;
  });
  return sortedArr;
}

function sort() {
  const userSelection = document.querySelector(".filter-products").value;

  if (userSelection === "price") {
    const filteredByPrice = filterByPrice(storageService.getProducts());
    renderProducts(filteredByPrice);
  }
  if (userSelection === "name") {
    const filteredByName = filterByName(storageService.getProducts());
    renderProducts(filteredByName);
  }

  return;
}

function updateCart(selectedProduct, num1, num2) {
  storageService.updateOneProduct(selectedProduct, num2);
  storageService.updateProductQnt(selectedProduct._id, num1);

  const updatedCart = storageService.getUserProducts();
  renderCart(updatedCart);
}

function addToCart(btnId) {
  const selectedProduct = storageService.getOneProduct(btnId);
  if (selectedProduct.quantity === 0)
    return alert(`No more ${searchProduct.name} left!`);
  updateCart(selectedProduct, -1, 1);
}

function renderCart(products) {
  const htmlProducts = products.map((product) => {
    const classNames = product.isAvailable
      ? "available-product"
      : "not-available-product";
    let addBtn = `<button class="plus-minus" onclick="addQtn('${product._id}')">+</button>`;
    let removeBtn = `<button class="plus-minus" onclick="removeQtn('${product._id}')">-</button>`;
    let productItem = `
      <tr>
      <td class="name-td-cart">${product.name}</td>
      <td class="price-td-cart">${product.price}</td>
      <td class="${classNames} cart-td-amount">${product.amount}</td>
      <td>${addBtn}${removeBtn}</td>
      </tr>
      `;
    return productItem;
  });

  document.querySelector(".cartTable").innerHTML = htmlProducts.join("");
}

function addQtn(productId) {
  const selectedProduct = storageService.getOneProduct(productId);
  if (selectedProduct.quantity === 0) return;
  updateCart(selectedProduct, -1, 1);
}

function removeQtn(productId) {
  const selectedProduct = storageService.getOneUserProduct(productId);
  updateCart(selectedProduct, 1, -1);
  if (selectedProduct.amount === 1) {
    updateCart(selectedProduct, 1, -1);
    storageService.removeOneUserProduct(selectedProduct._id);
    const products = storageService.getUserProducts();
    renderCart(products);
    return;
  }

  updateCart(productId, 1, -1);
}

function cartBuy() {
  document.querySelector(".btn-buy");

  window.location.href = "/buy.html";
}

//! ------------------------------------------- Buy Page ---------------------------------------
function initBuy() {
  const userProducts = storageService.getUserProducts();
  const totalPrice = getTotalPrice(userProducts);
  localStorage.setItem("totalPrice", totalPrice.toString());

  const totalAmount = amountOfProducts();

  document.querySelector(".total-price").innerHTML = totalPrice;
  document.querySelector(".amount-of-products").innerHTML = totalAmount;
}

async function placeOrder() {
  try {
    document.querySelector(".order-btn");
    const userProducts = storageService.getUserProducts();
    const cart = userProducts.map((product) => {
      return {
        name: product.name,
        amount: product.amount,
      };
    });

    const user = storageService.getUser();
    const userId = user._id;
    const isAdmin = user.isAdmin;

    const totalPrice = localStorage.getItem("totalPrice");
    const order = {
      userId,
      cart,
      totalPrice,
    };
    console.log(order);

    const response = await fetch("/api/all", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message);
      window.location.href = "/main.html";
      return;
    }

    const responseOrder = await fetch(`/api/all?isAdmin=${isAdmin}`);
    const dataOrder = await responseOrder.json();
    console.log(dataOrder.orders);

    if (!dataOrder.success) {
      alert(dataOrder.message);
    }
    const orders = dataOrder.orders;
    localStorage.setItem("orders", JSON.stringify(orders));
    window.location.href = "/orders.html";
  } catch (error) {
    console.log(error);
  }
}

function amountOfProducts() {
  const userProducts = storageService.getUserProducts();
  const amountProducts = userProducts.map((product) => product.amount);
  const total = amountProducts.reduce((acc, curr) => acc + curr);

  return total;
}

function getTotalPrice(userProducts) {
  let total = 0;
  for (let i = 0; i < userProducts.length; i++) {
    let productPrice = userProducts[i].price * userProducts[i].amount;
    total += productPrice;
  }
  //! another way:::: const totalPrice = userProducts.reduce((acc, curr) => acc + curr.price, 0);
  //! console.log(totalPrice)

  return total;
}
//! ------------------------------------------- Orders Page ------------------------------------
function renderOrders() {
  const orders = JSON.parse(localStorage.getItem("orders"));

  const htmlOrders = orders.map((order) => {
    let productInfo = "";
    for (let i = 0; i < order.cart.length; i++) {
      productInfo +=
        order.cart[i].name + " " + "[" + order.cart[i].amount + "]" + " ,";
    }

    let productItem = `
        <tr>
        <td class="orderId-td">${order._id}</td>
        <td class="order-user-td">${order.userId}</td>
        <td class="order-products-td">${productInfo}</td>
        </tr>
        `;
    return productItem;
  });

  document.querySelector(".ordersTable").innerHTML = htmlOrders.join("");
}

//! git add .
//! git commit -m "*changes done*"
//! git pull
//! git push
