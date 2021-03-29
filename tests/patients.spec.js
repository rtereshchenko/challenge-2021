const csv = require('csvtojson');
const { expect } = require('chai');
const { resolve: resolvePath } = require('path');
const { getPatients } = require('../common/helpers/patients');

describe('patients loaded correctly', () => {
  let foundPatients;
  let flatFileRecords;
  let consentedPatients;

  before(async function () {
    foundPatients = await getPatients();
  });

  before(async function () {
    flatFileRecords = await csv({ delimiter: '|' }).fromFile(resolvePath(__dirname, '../sample-data/data.csv'));
    consentedPatients = flatFileRecords.filter(({ CONSENT }) => CONSENT === 'Y');
  });

  it('data in flat file matches the data in Patients collection', async function () {
    expect(foundPatients).to.deep.equal(consentedPatients);
  });

  it('member ID with empty first name in flat file matches the id Patients collection', async function () {
    const patientsWithEmptyNamesFromDb = foundPatients.filter(patient => !patient['First Name']);
    const patientFromDbIDs = patientsWithEmptyNamesFromDb.map(patient => patient['Member ID']);

    this.test.consoleOutputs = [`Patient IDs where the first name is missing: ${patientFromDbIDs}`];

    const patientsWithEmptyNamesFromFile = consentedPatients.filter(patient => !patient['First Name']);
    const patientFromFileIDs = patientsWithEmptyNamesFromFile.map(patient => patient['Member ID']);

    expect(patientFromDbIDs).to.deep.equal(patientFromFileIDs);
  });

  it('member ID with missing email in flat file matches the id Patients collection', async function () {
    const patientsWithMissingEmailFromDb = foundPatients.filter(patient => !patient['Email Address']);
    const patientFromDbIDs = patientsWithMissingEmailFromDb.map(patient => patient['Member ID']);

    this.test.consoleOutputs = [`Patient IDs where the email is missing: ${patientFromDbIDs}`];

    const patientsWithMissingEmailFromFile = consentedPatients.filter(patient => !patient['Email Address']);
    const patientFromFileIDs = patientsWithMissingEmailFromFile.map(patient => patient['Member ID']);

    expect(patientFromDbIDs).to.deep.equal(patientFromFileIDs);
  });
});
