const csv = require('csvtojson');
const config = require('config');
const { expect } = require('chai');
const { resolve: resolvePath } = require('path');
const { dayInMs } = require('../constants');
const { getEmails } = require('../common/helpers/emails');

const { sourceFile } = config;

describe('emails scheduled correctly', () => {
  let foundEmails;
  let groupedEmails;
  let flatFileRecords;
  let consentedPatients;

  before(async function () {
    foundEmails = await getEmails();
    groupedEmails = foundEmails.reduce((grouped, email) => {
      grouped[email.email] = grouped[email.email]
        ? grouped[email.email].concat(email)
        : [email];
      return grouped;
    }, {});
  });

  before(async function () {
    flatFileRecords = await csv({ delimiter: '|' }).fromFile(resolvePath(__dirname, '../', sourceFile));
    consentedPatients = flatFileRecords.filter(({ CONSENT }) => CONSENT === 'Y');
  });

  it('emails were created in Emails Collection for patients who have CONSENT as Y', async function () {
    const patientsWithEmailFromFile = consentedPatients.filter(patient => patient['Email Address']);
    expect(foundEmails).to.have.lengthOf(patientsWithEmailFromFile.length * 4);

    foundEmails.forEach(email => {
      expect(email).to.have.property('_id');
      expect(email).to.have.property('name').and.matches(/^Day\s[1234]$/);
      expect(email).to.have.property('email');
      expect(email).to.have.property('scheduled_date');
    });
  });

  it('emails for each patient are scheduled correctly', async function () {
    Object.values(groupedEmails)
      .forEach(group => {
        let prevScheduledDate = 0;
        group.forEach((email, idx) => {
          expect(email).to.have.property('name').and.equals(`Day ${idx + 1}`);

          if (idx === 0) {
            prevScheduledDate = email.scheduled_date.getTime();
          } else {
            expect(email).to.have.property('scheduled_date');
            expect(email.scheduled_date.getTime()).to.equal(prevScheduledDate + dayInMs);
            prevScheduledDate = email.scheduled_date.getTime();
          }
        });
      });
  });
});
