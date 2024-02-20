const { getCollection, toObjectId } = require("./dbModule.js");

const entity = "orders";

async function getAllOrders() {
  try {
    const collection = await getCollection(entity);
    const orders = await collection.find().toArray();

    return orders;
  } catch (error) {
    throw error;
  }
}

async function createOrder(order) {
  try {
    const collection = await getCollection(entity);
    await collection.insertOne(order);
  } catch (error) {
    throw error;
  }
}

module.exports = { getAllOrders, createOrder };
