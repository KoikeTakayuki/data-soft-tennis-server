var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var service = require('./soft-tennis-data-service');
var connection = require('./sql-connection-provider').provideConnection();

app.use(bodyParser.urlencoded({extended: true}));


app.get('/player', function (req, res) {
  service
    .getPlayers(connection)
    .then(function (players) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(players));
    });
});

app.listen(80);
