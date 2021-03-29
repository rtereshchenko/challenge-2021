const { runApp } = require('./app');
const { shutdown } = require('./common/graceful-shutdown');

runApp()
  .catch(err => {
    console.log(err);
  })
  .finally(shutdown);
