var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var service = require('./soft-tennis-data-service');
var connection = require('./sql-connection-provider').provideConnection();

app.use(bodyParser.urlencoded({extended: true}));

var withHeader = function (w) {return w;}

var toJsonResponse = function (cont) {
  return function (req, res) {
     res.setHeader('Access-Control-Allow-Origin', '*');
     res.setHeader('Content-Type', 'application/json');
     cont(req).then(function (result) {
      res.send(JSON.stringify(result));
     }).catch(function (e) {
      console.log(e);
      res.send(null);
     }); 
  };
};


/* マスターデータ取得 */
app.get('/prefecture', toJsonResponse(function () {
  return service.MasterData.getPrefectures(connection);
}));

app.get('/team-division', toJsonResponse(function () {
  return service.MasterData.getTeamDivisions(connection);
}));

app.get('/round', toJsonResponse(function () {
  return service.MasterData.getRounds(connection);
}));

app.get('/tactics', toJsonResponse(function () {
  return service.MasterData.getTactics(connection);
}));

app.get('/competition-type', toJsonResponse(function () {
  return service.MasterData.getCompetitionTypes(connection);
}));

/* プレイヤー関連のデータ取得 */
app.get('/player/:playerId', toJsonResponse(function (req) {
  return service.Players.getPlayerById(connection, req.params.playerId);
}));

app.get('/player/:playerId/match', toJsonResponse(function (req) {
  return service.Players.getMatchesByPlayerId(connection, req.params.playerId);
}));

app.get('/player/birth-year/:birthYear', toJsonResponse(function (req) {
  return service.Players.getPlayersByBirthYear(connection, req.params.birthYear);
}));

app.get('/player', toJsonResponse(function () {
  return service.Players.getPlayers(connection);
}));

/* チーム関連のデータを取得 */
app.get('/team', toJsonResponse(function (req) {
  return service.Teams.getTeams(connection, req.query);
}));

app.get('/team/:teamId', toJsonResponse(function (req) {
  return service.Teams.getTeamById(connection, req.params.teamId);
}));

app.get('/team/:teamId/player', toJsonResponse(function (req) {
  return service.Teams.getTeamPlayers(connection, req.params.teamId);
}));

app.get('/team/:teamId/former-player', toJsonResponse(function (req) {
  return service.Teams.getFormerTeamPlayers(connection, req.params.teamId);
}));

/* 会場関連のデータを取得 */
app.get('/tennis-court', toJsonResponse(function () {
  return service.TennisCourts.getTennisCourts(connection);
}));

app.get('/tennis-court/:tennisCourtId', toJsonResponse(function (req) {
  return service.TennisCourts.getTennisCourtById(connection, req.params.tennisCourtId);
}));

app.get('/tennis-court/:tennisCourtId/competition', toJsonResponse(function (req) {
  return service.TennisCourts.TennisCounrtCompetitions(connection, req.params.tennisCourtId);
}));

/* 大会関連のデータを取得 */
app.get('/competition', toJsonResponse(function () {
  return service.Competitions.getCompetitions(connection);
}));

app.get('/competition/:competitionId', toJsonResponse(function (req) {
  return service.Competitions.getCompetitionById(connection, req.params.competitionId);
}));

app.get('/competition/:competitionId/match', toJsonResponse(function (req) {
  return service.Competitions.getMatchesByCompetitionId(connection, req.params.competitionId);
}));

/* 団体戦関連のデータを取得 */
app.get('/team-match', toJsonResponse(function () {
  return service.TeamMatch.getTeamMatches(connection);
}));

/* 試合関連のデータを取得 */
app.get('/match', toJsonResponse(function () {
  return service.Matches.getMatches(connection);
}));

app.get('/match/:matchId', toJsonResponse(function (req) {
  return service.Matches.getMatchById(connection, req.params.matchId);
}));


app.listen(80);
