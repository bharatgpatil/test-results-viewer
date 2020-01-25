function run(callback) {
  const express = require('express');
  const bodyParser = require('body-parser');
  const app = express();


  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, HEAD');
    next();
  });

  app.use(require('./routes/routes'));

  const server = app.listen(4400, function () {
    console.log('Sample API is running on 4400');
  });

  if (callback) {
    callback()
  }
  server.on('close', function () {
    console.log('closed Server')
  });

  return server;
}

if (require.main === module) {
  run();
}

module.exports = {
  run
};
