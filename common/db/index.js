const config = require('config');
const { MongoClient } = require('mongodb');

const { uri: mongoUri, db: mongoDb } = config.mongo;
let connection;

const connectToDb = async () => {
  if (connection) {
    return;
  }

  connection = await MongoClient.connect(mongoUri, { useUnifiedTopology: true });
};

const getCollection = async collectionName => {
  await connectToDb();
  const db = await connection.db(mongoDb);
  return await db.collection(collectionName);
};

const getPatientCollection = () => getCollection('Patients');
const getEmailCollection = () => getCollection('Emails');

const closeConnection = () => connection?.close();

module.exports = {
  getPatientCollection,
  getEmailCollection,
  closeConnection,
};
