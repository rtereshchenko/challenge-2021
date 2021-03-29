const { runApp } = require('./app');
const { closeConnection } = require('./common/db');

runApp()
  .catch(err => {
    console.log(err);
  })
  .finally(closeConnection);
