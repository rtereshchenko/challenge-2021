const config = require('config');
const { MongoClient } = require('mongodb');

const { uri: mongoUri, db: mongoDb } = config.mongo;

const connectToDb = async () => MongoClient.connect(mongoUri, { useUnifiedTopology: true });

const getCollections = async connection => {
  const db = await connection.db(mongoDb);
  const patients = await db.collection('Patients');
  const emails = await db.collection('Emails');

  return { patients, emails };
};

const closeConnection = connection => connection.close();

before(async function () {
  this.connection = await connectToDb();
  const { patients, emails } = await getCollections(this.connection);
  this.patients = patients;
  this.emails = emails;
});

after(async function () {
  await closeConnection(this.connection);
});
