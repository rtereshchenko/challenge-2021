const config = require('config');
const { closeDbConnection } = require('./db');
const { signals } = require('../constants');

const { killTimeout } = config;

const shutdown = async () => {
  console.log('stopping app...');
  const timer = setTimeout(async () => {
    console.log('force shutdown');
    await closeDbConnection({ force: true });
  }, killTimeout);

  await closeDbConnection();
  clearTimeout(timer);

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
