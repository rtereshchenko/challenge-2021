const { getEmailCollection } = require('../db');

const defaultSort = {
  scheduled_date: 1,
};

const getEmails = async (filter = {}, sort = defaultSort) => {
  const emailCollection = await getEmailCollection();
  const cursor = await emailCollection.find(filter, { sort });
  return await cursor.toArray();
};

const addEmailsBulk = async emails => {
  const emailCollection = await getEmailCollection();
  await emailCollection.insertMany(emails);
  return emails;
};

module.exports = {
  getEmails,
  addEmailsBulk,
};
