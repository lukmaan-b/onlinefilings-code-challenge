const { MongoClient } = require('mongodb');

// Connection URL to the MongoDB database. Change to your own connection string.
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

let connection;
const connectDb = async () => {
  connection =  await  client.connect()
  console.log('Connected to MongoDB');
}

// Returns mongodb database object.
const getDb = () => {
  try {
    return connection.db("todoList");
  } catch (error) {
    console.error(error);
  }
};

module.exports = {getDb, connectDb}