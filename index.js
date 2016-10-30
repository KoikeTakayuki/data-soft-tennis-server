var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var service = require('./soft-tennis-data-service');
var connection = require('./sql-connection-provider').provideConnection();

app.use(bodyParser.urlencoded({extended: true}));

var jsonRequestHandler = function(methodName) {
  return function(req, res){
    var proc = service[methodName];

    proc(connection).then(function (results) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(results));
    })
  };
};

app.get('/player', jsonRequestHandler('getPlayers'));

app.get('/team', jsonRequestHandler('getTeams'));
app.get('/team/works-team', jsonRequestHandler('getWorksTeams'));
app.get('/team/university', jsonRequestHandler('getUniversityTeams'));
app.get('/team/high-school', jsonRequestHandler('getHighSchoolTeams'));
app.get('/team/junior-high', jsonRequestHandler('getJuniorHighTeams'));


app.listen(80);
