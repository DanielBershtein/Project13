async function signinClick() {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
      return;
    }
    console.log(email, password);
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
  // storageService.setProducts();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const response = await fetch("/api/products");
  const dataProducts = await response.json(); //!
  renderProducts(dataProducts);
  storageService.setProducts(dataProducts);

  const productsMap = dataProducts.map((itemProduct) => {
    if (itemProduct.quantity === 0) {
      itemProduct.isAvailable === false;
    }
    return itemProduct;
  });

  const userProducts = storageService.getUserProducts();
  console.log(userProducts); //!
  if (userProducts.length > 0) {
    renderCart(userProducts);
  } else {
    const loadedProducts = user.products;
    console.log(loadedProducts);
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
    console.log(product.quantity);
    const textContent = product.isAvailable ? "Available" : "Not Available";
    const classNames = product.isAvailable
      ? "available-product"
      : "not-available-product";
    const btnId = product._id;
    let addBtn = `<button onclick="addToCart('${btnId}')">Add</button>`;
    let productItem = `
      <tr>
      <td>${product.name}</td>
      <td>${product.price}</td>
      <td class="${classNames}">${textContent}</td>
      <td>${product.quantity === 0 ? "Out Of Stock" : addBtn}</td>
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

async function addToCart(btnId) {
  updateProduct(btnId);
  const selectedProduct = storageService.getOneProduct(btnId);
  storageService.addOneProduct(selectedProduct);
  renderCart(selectedProduct);
}

function renderCart(products) {
  const htmlProducts = products.map((product) => {
    const textContent = product.isAvailable ? "Available" : "Not Available";
    const classNames = product.isAvailable
      ? "available-product"
      : "not-available-product";
    const btnId = product._id;
    let productItem = `
      <tr>
      <td>${product.name}</td>
      <td>${product.price}</td>
      <td class="${classNames}">${textContent}</td>
      <td><button>+</button><button>-</button></td>
      </tr>
      `;
    return productItem;
  });

  document.querySelector(".cartTable").innerHTML = htmlProducts.join("");
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

//! count = userProduct.name
//! if + = count++
//!removeOneProduct
//! DELETE to server to update mongo
//! push count to "amount"

//! git add .
//! git commit -m "*changes done*"
//! git pull
//! git push -u origin main
