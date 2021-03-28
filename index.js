const { createReadStream } = require('fs');
const { resolve: resolvePath } = require('path');
const csv = require('csvtojson');
const config = require('config');
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

const { sourceFile } = config;

const run = async () => {
  const source = createReadStream(resolvePath(__dirname, sourceFile));

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
              const currentTime = new Date().getTime();
              const emailRecords = daysToScheduleEmails
                .map(days => ({
                  email: record['Email Address'],
                  name: `Day ${days}`,
                  scheduled_date: new Date(currentTime + (days * dayInMs)),
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
