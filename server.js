const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const path = require("path");
const userModule = require("./modules/userModule.js");
const productModule = require("./modules/productModule.js");
const validator = require("validator");
const { nextTick } = require("process");
const { isEmail, isMobilePhone } = validator;

app.use(express.static("client"));
app.use(express.json());

// app.use((req, res, next) => {
//   if (req.url === "/query:admin=true") {
//     return res.redirect("/api/all");
//   } else {
//     res.status(400).send(error.message);
//   }
//   next();
// });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "main.html"));
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await productModule.getAllProducts();

    return res.send(products);
  } catch (error) {
    console.log(error);
    return res.status(400).send({ success: false, message: error.message });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    let isEmailValid = validator.isEmail(email);
    if (!isEmailValid) {
      alert("Email is Not Valid! Try Again 🤷‍♀️");
      return;
    }

    let isPasswordValid = validator.isStrongPassword(password, {
      minLength: 5,
    });

    if (!isPasswordValid) {
      alert(
        "Password must be 5-10 characters and contain at least one lower case, upper case, number and symbol!"
      );
      return;
    }
    await userModule.addUser(email, username, password);
    res.send({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ success: false, message: error.message });
  }
});

// app.post("/api/register", async (req, res) => {
//   try {
//     const { username, password, email } = req.body;
//     console.log(email, username, password);
//     await userModule.addUser(username, password, email);
//     res.send({ success: true });
//   } catch (error) {
//     console.log(error);
//     return res.status(400).send({ success: false, message: error.message });
//   }
// });

app.get("/api/all", async (req, res) => {}); //!

app.get("/api/login", async (req, res) => {
  try {
    const { email, password } = req.query;
    let isEmailValid = validator.isEmail(email);
    if (!isEmailValid) {
      return res.status(400).send("Email is Not Valid! Try Again 🤷‍♀️");
    }

    let isPasswordValid = validator.isStrongPassword(password, {
      minLength: 5,
    });

    if (!isPasswordValid) {
      return res
        .status(400)
        .send(
          "Password must be 5-10 characters and contain at least one lower case, upper case, number and symbol!"
        );
    }

    const user = await userModule.getUserByEmail(email, password);

    res.status(200).send({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, message: error.message });
  }
});

app.put("/api/cart", async (req, res) => {
  try {
    const { userId, productId } = req.query;
    const product = await productModule.getProductById(productId);
    const updatedUser = await userModule.addProductToUser(userId, product);
    return res.send(updatedUser);
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const { updatsedQtn, orders } = req.body;
    await orderModule.updateQtn(updatsedQtn);
    res.send({ success: true });
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
