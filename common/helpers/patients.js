const { getPatientCollection } = require('../db');
const { defaultProjection } = require('../../constants');

const getPatients = async (filter = {}, sort = {}, projection = defaultProjection) => {
  const patientCollection = await getPatientCollection();
  const cursor = await patientCollection.find(filter, { sort, projection });
  const patients = await cursor.toArray();
  return patients;
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
