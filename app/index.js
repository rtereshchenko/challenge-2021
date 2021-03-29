const { createReadStream } = require('fs');
const { resolve: resolvePath } = require('path');
const csv = require('csvtojson');
const config = require('config');
const {
  emailRegex,
  dayInMs,
  daysToScheduleEmails,
} = require('../constants');
const { addPatient } = require('../common/helpers/patients');
const { addEmailsBulk } = require('../common/helpers/emails');

const { sourceFile } = config;

const runApp = async () => {
  const source = createReadStream(resolvePath(__dirname, '../', sourceFile));

  await new Promise((resolve, reject) => {
    csv({ delimiter: '|' })
      .fromStream(source)
      .subscribe(
        async record => {
          if (record.CONSENT === 'Y') {
            await addPatient(record);

            if (emailRegex.test(record['Email Address'])) {
              const currentTime = new Date().getTime();
              const emailRecords = daysToScheduleEmails
                .map(days => ({
                  email: record['Email Address'],
                  name: `Day ${days}`,
                  scheduled_date: new Date(currentTime + (days * dayInMs)),
                }));

              await addEmailsBulk(emailRecords);
            }
          }
        },
        err => reject(err),
        () => resolve(),
      );
  });
};

module.exports = {
  runApp,
};
