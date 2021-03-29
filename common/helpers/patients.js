const { getPatientCollection } = require('../db');

const defaultProjection = {
  _id: 0,
};

const getPatients = async (filter = {}, sort = {}, projection = defaultProjection) => {
  const patientCollection = await getPatientCollection();
  const cursor = await patientCollection.find(filter, { sort, projection });
  return await cursor.toArray();
};

const addPatient = async patient => {
  const patientCollection = await getPatientCollection();
  await patientCollection.insertOne(patient);
  return patient;
};

module.exports = {
  getPatients,
  addPatient,
};
