var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var service = require('./soft-tennis-data-service');
var connection = require('./sql-connection-provider').provideConnection();

app.use(bodyParser.urlencoded({extended: true}));

var withHeader = function (cont) {
  return function (req, res) {
     res.setHeader('Access-Control-Allow-Origin', '*');
     res.setHeader('Content-Type', 'application/json');
     cont(req, res);
  };
};

var simpleQuery = function(methodName) {
  return withHeader(function(req, res){
    var proc = service[methodName];

    proc(connection).then(function (results) {
      res.send(JSON.stringify(results));
    });
  });
};


app.get('/player', simpleQuery('getPlayers'));

app.get('/team', simpleQuery('getTeams'));
app.get('/tennis-court', simpleQuery('getTennisCourts'));
app.get('/team/works-team', simpleQuery('getWorksTeams'));
app.get('/team/university', simpleQuery('getUniversityTeams'));
app.get('/team/high-school', simpleQuery('getHighSchoolTeams'));
app.get('/team/junior-high', simpleQuery('getJuniorHighTeams'));

app.get('/competition', simpleQuery('getCompetitions'));

app.get('/match', simpleQuery('getMatches'));


app.get('/competition/:competitionId', withHeader(function (req, res) {
  service
    .getCompetitionById(connection, req.params.competitionId)
    .then(function (competition) { 
      res.send(JSON.stringify(competition));
     });
  })
);

app.get('/competition/:competitionId/match', withHeader(function (req, res) {
  service
    .getMatchesByCompetitionId(connection, req.params.competitionId)
    .then(function (competition) { 
      res.send(JSON.stringify(competition));
    });
  })
);

app.get('/team/:teamId', withHeader(function (req, res) {
  service
    .getTeamById(connection, req.params.teamId)
    .then(function (team) { 
      res.send(JSON.stringify(team));
    });
  })
);

app.get('/team/:teamId/player', withHeader(function (req, res) {
  service
    .getPlayersByTeamId(connection, req.params.teamId)
    .then(function (players) { 
      res.send(JSON.stringify(players));
    });
  })
);

app.get('/team/:teamId/former-player', withHeader(function (req, res) {
  service
    .getFormerPlayersByTeamId(connection, req.params.teamId)
    .then(function (players) { 
      res.send(JSON.stringify(players));
    });
  })
);

app.get('/player/:playerId', withHeader(function (req, res) {
  service
    .getPlayerById(connection, req.params.playerId)
    .then(function (playerAndTeamData) { 
      res.send(JSON.stringify(playerAndTeamData));
    });
  })
);

app.get('/player/birth-year/:birthYear', withHeader(function (req, res) {
  service
    .getPlayersByBirthYear(connection, req.params.birthYear)
    .then(function (players) { 
      res.send(JSON.stringify(players));
    });
  })
);


app.get('/player/:playerId/match', withHeader(function (req, res) {
  service
    .getMatchesByPlayerId(connection, req.params.playerId)
    .then(function (matches) { 
      res.send(JSON.stringify(matches));
    });
  })
);

app.get('/match/:matchId', withHeader(function (req, res) {
  service
    .getMatchById(connection, req.params.matchId)
    .then(function (match) { 
      res.send(JSON.stringify(match));
    });
  })
);

app.get('/tennis-court/:tennisCourtId', withHeader(function () {
  service
    .getTennisCourtById(connection, req.params.tennisCourtId)
    .then(function (tennisCourt) {
      res.send(JSON.stringify(tennisCourt));
    });
}));

app.listen(80);
