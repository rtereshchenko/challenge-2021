const { closeConnection } = require('../common/db');

after(async function () {
  await closeConnection();
});
