const { MongoClient } = require("mongodb");

// Connection URL to the MongoDB database. Change to your own connection string.
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

let db;
const connectDb = async () => {
  const connection = await client.connect(); // Connect to the MongoDB database.
  db = connection.db("todoList"); // Change to your own database name.
  console.log("Connected to MongoDB");
};

// Returns mongodb database object.
const getDb = () => {
  try {
    return db;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { getDb, connectDb };
