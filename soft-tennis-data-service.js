var RecordTypes = require('./record-types');
var Or = require('./rql/logic/Or');
var And = require('./rql/logic/And');
var Not = require('./rql/logic/Not');

var service = {};

service.Competitions = {

  getCompetitions: function (connection) {
    return RecordTypes.Competition.all(connection, null, ['tennis_court', 'competition_type']);
  },
  getCompetitionById: function (connection, competitionId) {
    return RecordTypes.Competition.first(connection, {id: competitionId}, ['tennis_court', 'competition_type']);
  },
  getMatchesByCompetitionId: function (connection, competitionId) {
    return RecordTypes.Match.all(connection, {competition_id: competitionId}, ['player1', 'player2', 'player3', 'player4']);
  },
};

service.Players = {

  getPlayerById: function (connection, playerId) {
    return RecordTypes.Player.first(connection, {id: playerId}, ['junior_high_team', 'high_school_team', 'university_team','current_team']);
  },
  getPlayersByBirthYear: function (connection, birthYear) {
    return RecordTypes.Player.all(connection, {birth_year: birthYear}, ['junior_high_team', 'high_school_team', 'university_team','current_team']);
  },
  getMatchesByPlayerId: function (connection,playerId) {
    return RecordTypes.Match.all(connection, {player1_id: playerId, player2_id: playerId, player3_id: playerId, player4_id: playerId}, ['player']);
  },
  getPlayers: function (connection) {
    return RecordTypes.Player.all(connection, null, ['current_team']);
  }

};

service.Teams = {

  getTeams: function (connection, condition) {
    return RecordTypes.Team.all(connection, condition, ['prefecture']);
  },
  getTeamById: function (connection, teamId) {
    return RecordTypes.Team.first(connection, {id: teamId}, ['prefecture', 'team_division']);
  },
  getTeamPlayers: function (connection, teamId) {
    return RecordTypes.Player.all(connection, {current_team_id: teamId}, ['prefecture', 'current_team']);
  },
  getFormerTeamPlayers: function (connection, teamId) {
    return RecordTypes.Player.all(connection, new And(new Or({junior_high_team_id: teamId, high_school_team_id: teamId, university_team_id: teamId}), new Not({current_team_id: teamId})), ['prefecture', 'current_team']);
  }
};

service.TeamMatch = {
  getTeamMatches: function (connection) {
    return RecordTypes.TeamMatch.all(connection);
  }
};

service.Matches = {

  getMatches: function (connection, condition) {
    return RecordTypes.Match.all(connection, condition, ['competition']);
  },
  getMatchById: function (connection, matchId) {
    return RecordTypes.Match.first(connection, {id: matchId}, ['player1', 'player2', 'player3', 'player4', 'tennis_court'])
  }
};

service.TennisCourts = {
  getTennisCourts: function (connection, condition) {
    return RecordTypes.TennisCourt.all(connection, condition, ['prefecture', 'court_surface']);
  },
  getTennisCourtById: function (connection, tennisCourtId) {
    return RecordTypes.TennisCourt.first(connection, {id: tennisCourtId}, ['prefecture', 'court_surface']);
  },
  TennisCounrtCompetitions: function (connection, tennisCourtId) {
    return RecordTypes.Competition.all(connection, {tennis_court_id: tennisCourtId}, ['competition_type']);
  },
};

service.MasterData = {
  getPrefectures: function (connection) {
    return RecordTypes.Prefecture.all(connection);
  },
  getTeamDivisions: function (connection) {
    return RecordTypes.TeamDivision.all(connection);
  },
  getRounds: function (connection) {
    return RecordTypes.Round.all(connection);
  },
  getTactics: function (connection) {
    return RecordTypes.Tactics.all(connection);
  },
  getCompetitionTypes: function (connection) {
    return RecordTypes.CompetitionType.all(connection);
  },
  getCompetitionTags: function (connection) {
    return RecordTypes.CompetitionTag.all(connection);
  }
};

module.exports = service;
