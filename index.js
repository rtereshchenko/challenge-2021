const { createReadStream } = require('fs');
const { resolve } = require('path');
const csv = require('csvtojson');
const { v4: uuid } = require('uuid');
const {
  connectToDb,
  getCollections,
  closeConnection,
} = require('./helpers');
const {
  emailRegex,
  dayInMs,
  daysToScheduleEmails,
} = require('./constants');

const run = async () => {
  const source = createReadStream(resolve(__dirname, 'sample-data/data.csv'));

  await connectToDb();
  const { patients, emails } = await getCollections();

  await new Promise((resolve, reject) => {
    csv({ delimiter: '|' })
      .fromStream(source)
      .subscribe(
        async record => {
          if (record.CONSENT === 'Y') {
            await patients.insertOne(record);

            if (emailRegex.test(record['Email Address'])) {
              const emailRecords = daysToScheduleEmails
                .map(days => ({
                  id: uuid(),
                  email: record['Email Address'],
                  name: `Day ${days}`,
                  scheduled_date: new Date().getTime() + (days * dayInMs),
                }));

              await emails.insertMany(emailRecords);
            }
          }
        },
        err => reject(err),
        () => resolve(),
      );
  });

  await closeConnection();
};

run()
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
