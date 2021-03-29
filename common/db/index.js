const config = require('config');
const { MongoClient } = require('mongodb');

const { uri: mongoUri, db: mongoDb } = config.mongo;

const connectToDb = () => {
  let connection;
  const getDbConnection = async () => {
    if (connection) {
      return connection;
    }

    connection = await MongoClient.connect(mongoUri, { useUnifiedTopology: true });
    return connection;
  };

  return getDbConnection;
};

const getDbConnection = connectToDb();

const getCollection = async collectionName => {
  const connection = await getDbConnection();
  const db = await connection.db(mongoDb);
  const collection = db.collection(collectionName);
  return collection;
};

const getPatientCollection = () => getCollection('Patients');
const getEmailCollection = () => getCollection('Emails');

const closeDbConnection = async ({ force = false } = {}) => {
  const connection = await getDbConnection();
  await connection?.close(force);
};

module.exports = {
  getPatientCollection,
  getEmailCollection,
  closeDbConnection,
};
