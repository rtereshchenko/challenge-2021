const config = require('config');
const { closeDbConnection } = require('./db');
const { signals } = require('../constants');

const { killTimeout } = config;

const shutdown = async () => {
  console.log('stopping app...');
  await closeDbConnection();
  await new Promise(resolve => setTimeout(resolve, killTimeout));
  await closeDbConnection({ force: true });
  console.log('app stopped');
};

signals.forEach(signal => {
  process.on(signal, async () => {
    console.log(`signal ${signal} received`);
    await shutdown();
  });
});

module.exports = {
  shutdown,
};
