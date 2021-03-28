const config = require('config');
const { MongoClient } = require('mongodb');

const { uri: mongoUri, db: mongoDb } = config.mongo;
let connection;

const connectToDb = async () => {
  connection = await MongoClient.connect(mongoUri, { useUnifiedTopology: true });
};

const getCollections = async () => {
  const db = await connection.db(mongoDb);
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
