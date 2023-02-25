const { MongoClient } = require("mongodb");

// Connection URL to the MongoDB database. Change to your own connection string.
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

let db;
let connection;
/**
 * connectDb
 * Connect to the MongoDB database and set the database connection.
 *
 */
const connectDb = async () => {
  connection = await client.connect(); // Connect to the MongoDB database.
  db = connection.db("todoList"); // Change to your own database name.
  console.log("Connected to MongoDB");
};

/**
 * getDb
 * Get the database connection.
 * @returns {Object} Returns the database connection.
 */
const getDb = () => {
  try {
    return db;
  } catch (error) {
    console.error(error);
  }
};

/**
 * clearTasks
 * Clear all tasks from the database.
 */
const clearTasks = async () => {
  try {
    const db = getDb();
    await db.collection("tasks").deleteMany({});
  } catch (error) {
    console.error(error);
  }
};

/**
 * clearProjects
 * Clear all projects from the database.
 */
const clearProjects = async () => {
  try {
    const db = getDb();
    await db.collection("projects").deleteMany({});
  } catch (error) {
    console.error(error);
  }
};

/**
 * closeConnection
 * Close the database connection.
 */
const closeConnection = async () => {
  await connection.close();
};

module.exports = {
  getDb,
  connectDb,
  clearTasks,
  clearProjects,
  closeConnection,
};
