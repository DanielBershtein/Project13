async function signinClick() {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
      return;
    }
    const response = await fetch(
      `/api/login?email=${email}&password=${password}`
    );
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

  const response = await fetch("/api/products");
  const dataProducts = await response.json();

  const productsMap = dataProducts.map((itemProduct) => {
    if (itemProduct.quantity === 0) {
      itemProduct.isAvailable === false;
    }
    return itemProduct;
  });

  storageService.setProducts(productsMap);
  renderProducts(productsMap);

  const userProducts = storageService.getUserProducts();
  if (userProducts.length > 0) {
    renderCart(userProducts);
  } else {
    const loadedProducts = user.products;
    if (loadedProducts || loadedProducts.length > 0) {
      storageService.setUserProducts(loadedProducts);
      renderCart(loadedProducts);
    }
  }
}

//! const response2 = await fetch("/api/cart")
//! const userProducts = await response.json()
//! renderCart(userProducts)
//! storageService.setUserProducts(userProducts)

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

function updateCart(productId, num1, num2) {
  // await updateProduct(btnId);
  const selectedProduct = storageService.getOneProduct(productId);
  storageService.updateOneProduct(selectedProduct, num2);
  storageService.updateProductQnt(productId, num1);

  const updatedCart = storageService.getUserProducts();
  renderCart(updatedCart);
}

function addToCart(btnId) {
  const selectedProduct = storageService.getOneProduct(btnId);
  if (selectedProduct.quantity === 0) return;
  updateCart(btnId, -1, 1);
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
      <td class="${classNames}">${product.amount}</td>
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
  updateCart(productId, -1, 1);
}

function removeQtn(productId) {
  const selectedProduct = storageService.getOneUserProduct(productId);
  if (selectedProduct.amount === 1) {
    updateCart(productId, 1, -1);
    storageService.removeOneUserProduct(productId);
    const products = storageService.getUserProducts();
    renderCart(products);
    return;
  }

  updateCart(productId, 1, -1);
}

async function updateProduct(btnId) {
  try {
    const userId = storageService.getUser()._id;
    console.log(userId);
    const response = await fetch(
      `/api/cart?userId=${userId}&productId=${btnId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await response.json();
    storageService.setUserProducts(data.products);
  } catch (error) {
    console.log(error);
  }
}

function cartBuy() {
  document.querySelector(".btn-buy");
  window.location.href = "/buy.html";
}

function placeOrder() {
  document.querySelector(".order-btn");
  window.location.href = "/main.html";
}

//! count = userProduct.name
//! if + = count++
//!removeOneProduct
//! DELETE to server to update mongo
//! push count to "amount"

//! git add .
//! git commit -m "*changes done*"
//! git pull
//! git push -u origin main
