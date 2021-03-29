const { shutdown } = require('../common/graceful-shutdown');

after(async function () {
  await shutdown();
});
