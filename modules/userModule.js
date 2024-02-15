const { getCollection, toObjectId } = require("./dbModule");

const entity = "users";

async function addUser(username, password, email) {
  try {
    const collection = await getCollection(entity);
    const existUser = await collection.findOne({ username });
    if (existUser) {
      throw new Error("user already exists 🤷‍♀️");
    }
    await collection.insertOne({
      username,
      password,
      email,
      isAdminTrue: false,
      products: [],
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getUserByEmail(email) {
  try {
    const collection = await getCollection(entity);
    const user = await collection.findOne({ email });
    if (!user) throw new Error("Email Not found");
    const { password, ...restUserDetails } = user;
    return restUserDetails;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function addProductToUser(userId, product) {
  try {
    const collection = await getCollection(entity);
    const user = await collection.findOne(toObjectId(userId));
    console.log(product);
    const result = await collection.updateOne(
      { _id: toObjectId(userId) },
      { $addToSet: { products: product } }
    );

    console.log(user);
    return user;
  } catch (err) {
    console.error("Error adding product to user:", err);
  }
}

async function getUserProducts(userId = null) {
  try {
    const collection = await getCollection(entity);
    const filter = userId === null ? {} : { creatorId: toObjectId(userId) };
    const userProducts = await collection.find(filter).toArray();
    return userProducts;
  } catch (error) {
    throw error;
  }
}

module.exports = { addUser, getUserByEmail, addProductToUser, getUserProducts };
