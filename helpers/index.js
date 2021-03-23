const { MongoClient } = require('mongodb');

const {
  MONGO_URI,
  MONGO_DB,
} = process.env;

let connection;

const connectToDb = async () => {
  connection = await MongoClient.connect(MONGO_URI, { useUnifiedTopology: true });
};

const getCollections = async () => {
  const db = await connection.db(MONGO_DB);
  const patients = await db.collection('Patients');
  const emails = await db.collection('Emails');

  return { patients, emails };
};

const closeConnection = () => connection.close();

module.exports = {
  connectToDb,
  getCollections,
  closeConnection,
};
