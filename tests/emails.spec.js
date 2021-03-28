const csv = require('csvtojson');
const config = require('config');
const { expect } = require('chai');
const { resolve: resolvePath } = require('path');
const { dayInMs } = require('../constants');

const { sourceFile } = config;

describe('emails scheduled correctly', () => {
  before(async function () {
    const cursor = await this.emails.find({}, {
      sort: {
        scheduled_date: 1,
      },
    });
    this.foundEmails = await cursor.toArray();
    this.groupedEmails = this.foundEmails.reduce((grouped, email) => {
      grouped[email.email] = grouped[email.email]
        ? grouped[email.email].concat(email)
        : [email];
      return grouped;
    }, {});
  });

  before(async function () {
    this.flatFileRecords = await csv({ delimiter: '|' }).fromFile(resolvePath(__dirname, '../', sourceFile));
    this.consentedPatients = this.flatFileRecords.filter(({ CONSENT }) => CONSENT === 'Y');
  });

  it('emails were created in Emails Collection for patients who have CONSENT as Y', async function () {
    const patientsWithEmailFromFile = this.consentedPatients.filter(patient => patient['Email Address']);
    expect(this.foundEmails).to.have.lengthOf(patientsWithEmailFromFile.length * 4);

    this.foundEmails.forEach(email => {
      expect(email).to.have.property('_id');
      expect(email).to.have.property('name').and.matches(/^Day\s[1234]$/);
      expect(email).to.have.property('email');
      expect(email).to.have.property('scheduled_date');
    });
  });

  it('emails for each patient are scheduled correctly', async function () {
    Object.values(this.groupedEmails)
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
