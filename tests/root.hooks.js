const { MongoClient } = require('mongodb');

const {
  MONGO_URI,
  MONGO_DB,
} = process.env;

const connectToDb = async () => MongoClient.connect(MONGO_URI, { useUnifiedTopology: true });

const getCollections = async connection => {
  const db = await connection.db(MONGO_DB);
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
