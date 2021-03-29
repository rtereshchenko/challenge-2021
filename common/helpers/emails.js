const { getEmailCollection } = require('../db');
const { defaultSort } = require('../../constants');

const getEmails = async (filter = {}, sort = defaultSort) => {
  const emailCollection = await getEmailCollection();
  const cursor = await emailCollection.find(filter, { sort });
  const emails = await cursor.toArray();
  return emails;
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
