const csv = require('csvtojson');
const { expect } = require('chai');
const { resolve } = require('path');

describe('patients loaded correctly', () => {
  before(async function () {
    const cursor = await this.patients.find({}, {
      projection: {
        _id: 0,
      },
    });
    this.foundPatients = await cursor.toArray();
  });

  before(async function () {
    this.flatFileRecords = await csv({ delimiter: '|' }).fromFile(resolve(__dirname, '../sample-data/data.csv'));
    this.consentedPatients = this.flatFileRecords.filter(({ CONSENT }) => CONSENT === 'Y');
  });

  it('data in flat file matches the data in Patients collection', async function () {
    expect(this.foundPatients).to.deep.equal(this.consentedPatients);
  });

  it('member ID with empty first name in flat file matches the id Patients collection', async function () {
    const patientsWithEmptyNamesFromDb = this.foundPatients.filter(patient => !patient['First Name']);
    const patientFromDbIDs = patientsWithEmptyNamesFromDb.map(patient => patient['Member ID']);

    this.test.consoleOutputs = [`Patient IDs where the first name is missing: ${patientFromDbIDs}`];

    const patientsWithEmptyNamesFromFile = this.consentedPatients.filter(patient => !patient['First Name']);
    const patientFromFileIDs = patientsWithEmptyNamesFromFile.map(patient => patient['Member ID']);

    expect(patientFromDbIDs).to.deep.equal(patientFromFileIDs);
  });

  it('member ID with missing email in flat file matches the id Patients collection', async function () {
    const patientsWithMissingEmailFromDb = this.foundPatients.filter(patient => !patient['Email Address']);
    const patientFromDbIDs = patientsWithMissingEmailFromDb.map(patient => patient['Member ID']);

    this.test.consoleOutputs = [`Patient IDs where the email is missing: ${patientFromDbIDs}`];

    const patientsWithMissingEmailFromFile = this.consentedPatients.filter(patient => !patient['Email Address']);
    const patientFromFileIDs = patientsWithMissingEmailFromFile.map(patient => patient['Member ID']);

    expect(patientFromDbIDs).to.deep.equal(patientFromFileIDs);
  });
});
