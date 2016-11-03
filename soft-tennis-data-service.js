var RecordTypes = require('./record-types');
var Or = require('./rql/logic/Or');
var And = require('./rql/logic/And');
var Not = require('./rql/logic/Not');

var service = {};

var createQueryPromise = function(query, data, getOnlyFirst) {

    return function(connection) {

        return new Promise(function(success, failure) {

            var callback = function(err, result) {

                if (err) {
                    failure(err);
                } else if (getOnlyFirst) {
                    if (result[0]) {
                        success(result[0]);
                    } else {
                        success(null);
                    }
                } else {
                    success(result);
                }
            };

            if (!data) {
                connection.query(query, callback);
            } else {
                connection.query(query, data, callback);
            }
        });
    };
};


service.getWorksTeams = createQueryPromise('SELECT t.id AS id, t.name AS name, t.team_division_id AS team_division_id, p.name AS prefecture_name FROM team AS t INNER JOIN prefecture AS p ON t.prefecture_id = p.id WHERE t.team_division_id = 5');
service.getUniversityTeams = createQueryPromise('SELECT t.id AS id, t.name AS name, t.team_division_id AS team_division_id, p.name AS prefecture_name FROM team AS t INNER JOIN prefecture AS p ON t.prefecture_id = p.id WHERE t.team_division_id = 4');
service.getHighSchoolTeams = createQueryPromise('SELECT t.id AS id, t.name AS name, t.team_division_id AS team_division_id, p.name AS prefecture_name FROM team AS t INNER JOIN prefecture AS p ON t.prefecture_id = p.id WHERE t.team_division_id = 3');
service.getJuniorHighTeams = createQueryPromise('SELECT t.id AS id, t.name AS name, t.team_division_id AS team_division_id, p.name AS prefecture_name FROM team AS t INNER JOIN prefecture AS p ON t.prefecture_id = p.id WHERE t.team_division_id = 2');


service.getMatches = createQueryPromise('SELECT * FROM soft_tennis_match');

service.getMatchesByCompetitionId = function (connection, competitionId) {
    return createQueryPromise('SELECT * FROM soft_tennis_match WHERE ?', { competition_id: competitionId })(connection);
};

service.getTeamById = function (connection, teamId) {
    return createQueryPromise('SELECT * FROM team WHERE ?', { id: teamId }, true)(connection);
};

service.getPlayersByTeamId = function (connection, teamId) {
    return createQueryPromise('SELECT * FROM player WHERE ?', { current_team_id: teamId })(connection);
};

service.getFormerPlayersByTeamId = function (connection, teamId) {
    return createQueryPromise({
        sql: 'SELECT * FROM player WHERE NOT(current_team_id = ?) AND (junior_high_team_id = ? OR high_school_team_id = ? OR university_team_id = ?)',
        values: [teamId, teamId, teamId, teamId]
    })(connection);
};

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

  getMatches: function (connection) {
    return RecordTypes.Match.all(connection);
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
  }
};


service.getMatchById = function (connection, matchId) {
    return createQueryPromise({
        sql: 'SELECT m.id AS id, m.title AS title, m.url AS url, m.date AS date, t.id AS tennis_court_id, t.name AS tennis_court_name, p1.id AS player1_id, p1.name AS player1_name, p2.id AS player2_id, p2.name AS player2_name, p3.id AS player3_id, p3.name AS player3_name, p4.id AS player4_id, p4.name AS player4_name FROM ((((soft_tennis_match AS m INNER JOIN player AS p1 ON p1.id = m.player1_id) INNER JOIN player AS p2 ON p2.id = m.player2_id) INNER JOIN player AS p3 ON p3.id = m.player3_id) INNER JOIN player AS p4 ON p4.id = m.player4_id) INNER JOIN tennis_court AS t ON t.id = m.tennis_court_id WHERE m.id = ?',
        values: [matchId]
    }, null, true)(connection);
};

service.getTennisCourts = function (connection) {
    return createQueryPromise('SELECT t.id AS id, t.name AS name, t.url AS url, t.phone_number AS phone_number, p.id AS prefecture_id, p.name AS prefecture_name, t.address AS address, t.latitude AS latitude, t.longitude AS longitude FROM tennis_court AS t INNER JOIN prefecture AS p ON p.id = t.prefecture_id')(connection);
};

service.getTennisCourtById = function (connection, tennisCourtId) {
    return createQueryPromise('SELECT t.id AS id, t.name AS name, t.url AS url, t.phone_number AS phone_number, p.id AS prefecture_id, p.name AS prefecture_name, t.address AS address, t.latitude AS latitude, t.longitude AS longitude FROM tennis_court AS t INNER JOIN prefecture AS p ON p.id = t.prefecture_id WHERE ?', {"t.id": tennisCourtId}, true)(connection);
};

service.getCompetitionsByTennisCourtId = function (connection, tennisCourtId) {
    return createQueryPromise('SELECT * FROM competition WHERE ?', {tennis_court_id: tennisCourtId})(connection);
};


module.exports = service;
