const config = require('config');
const { closeDbConnection } = require('./db');

const { killTimeout } = config;

const shutdown = async () => {
  await closeDbConnection();
  await new Promise(resolve => setTimeout(resolve, killTimeout));
  await closeDbConnection({ force: true });
};

module.exports = {
  shutdown,
};
