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

app.get('/competition', jsonRequestHandler('getCompetitions'));

app.get('/match', jsonRequestHandler('getMatches'));


app.get('/competition/:competitionId', function (req, res) {
  service.getCompetitionById(connection, req.params.competitionId).then(function (competition) { 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(competition));
  })
});

app.get('/competition/:competitionId/match', function (req, res) {
  service.getMatchesByCompetitionId(connection, req.params.competitionId).then(function (competition) { 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(competition));
  })
});

app.get('/team/:teamId', function (req, res) {
  service.getTeamById(connection, req.params.teamId).then(function (team) { 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(team));
  })
});

app.get('/team/:teamId/players', function (req, res) {
  service.getPlayersByTeamId(connection, req.params.teamId).then(function (players) { 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(players));
  })
});

app.listen(80);
