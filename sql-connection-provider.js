var sqlConnectionProvider = {};
var mysql = require('mysql');
var dbConfig = require('./config/mysql-config');

var connection;

sqlConnectionProvider.provideConnection = function () {
  if (!connection) {
    connection = mysql.createConnection(dbConfig, function (err) {
      if (err) {
        throw err;
      }
    });
  }

  return connection;
};

module.exports = sqlConnectionProvider;