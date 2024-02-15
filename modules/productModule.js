const { getCollection, toObjectId } = require("./dbModule.js");

const entity = "products";

const gProducts = [
  { name: "Sugar", price: 8, isAvailable: true, quantity: 23 },
  { name: "Milk", price: 12, isAvailable: true, quantity: 45 },
  { name: "Bread", price: 5, isAvailable: true, quantity: 8 },
  { name: "Gum", price: 3, isAvailable: false, quantity: 0 },
  { name: "Olive Oil", price: 20, isAvailable: true, quantity: 12 },
  { name: "Tomato", price: 2, isAvailable: true, quantity: 32 },
  { name: "Potato", price: 5, isAvailable: true, quantity: 9 },
  { name: "Cucumber", price: 3, isAvailable: false, quantity: 0 },
  { name: "Onion", price: 7, isAvailable: true, quantity: 30 },
  { name: "Vegan Milk", price: 18, isAvailable: true, quantity: 17 },
  { name: "Yellow Cheese", price: 12, isAvailable: false, quantity: 0 },
  { name: "White Cheese", price: 8, isAvailable: true, quantity: 25 },
  { name: "Carrot", price: 4, isAvailable: true, quantity: 38 },
  { name: "Apple", price: 9, isAvailable: true, quantity: 10 },
  { name: "Banana", price: 11, isAvailable: true, quantity: 28 },
  { name: "Orange", price: 8, isAvailable: true, quantity: 13 },
  { name: "Watermelon", price: 24, isAvailable: false, quantity: 0 },
  { name: "Laundry Powder", price: 16, isAvailable: true, quantity: 22 },
  { name: "Zuccini", price: 12, isAvailable: true, quantity: 36 },
  { name: "Hummus", price: 15, isAvailable: true, quantity: 20 },
  { name: "Dish Soap", price: 13, isAvailable: true, quantity: 17 },
  { name: "Dish Capsule", price: 21, isAvailable: false, quantity: 0 },
  { name: "Hand paper", price: 10, isAvailable: true, quantity: 42 },
  { name: "Toilet Paper", price: 28, isAvailable: true, quantity: 16 },
  { name: "Mango", price: 15, isAvailable: true, quantity: 19 },
  { name: "Red Wine", price: 48, isAvailable: true, quantity: 18 },
  { name: "White Wine", price: 46, isAvailable: true, quantity: 10 },
  { name: "Granolla", price: 25, isAvailable: true, quantity: 34 },
  { name: "Yogurt", price: 7, isAvailable: true, quantity: 26 },
  { name: "Pasta", price: 12, isAvailable: true, quantity: 5 },
];

// addManyProducts();
async function addManyProducts() {
  try {
    const collection = await getCollection(entity);

    await collection.insertMany(gProducts);
  } catch (error) {
    console.log(error);
  }
}

async function getAllProducts() {
  try {
    const collection = await getCollection(entity);
    const products = await collection.find().toArray();
    return products;
  } catch (error) {
    throw error;
  }
}

async function createProduct(product) {
  try {
    const collection = await getCollection(entity);
    const newProduct = { ...product, creatorId: toObjectId(product.creatorId) };
    const result = await collection.insertOne(newProduct);
    newProduct._id = result.insertedId;
    return newProduct;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getProductById(productId) {
  try {
    const collection = await getCollection(entity);
    const product = await collection.findOne(toObjectId(productId));
    const { isAvailable, _id, quantity, ...restProductDetails } = product;
    return restProductDetails;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
};
