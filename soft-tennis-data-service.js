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

service.getPlayers = createQueryPromise('SELECT p.id AS id, p.name AS name, p.birth_year AS birth_year, t.id AS team_id, t.name AS team_name FROM player AS p INNER JOIN team AS t ON t.id = p.current_team_id');
service.getTeams = createQueryPromise('SELECT t.id AS id, t.name AS name, t.team_division_id AS team_division_id, p.name AS prefecture_name FROM team AS t INNER JOIN prefecture AS p ON t.prefecture_id = p.id');

service.getWorksTeams = createQueryPromise('SELECT t.id AS id, t.name AS name, t.team_division_id AS team_division_id, p.name AS prefecture_name FROM team AS t INNER JOIN prefecture AS p ON t.prefecture_id = p.id WHERE t.team_division_id = 5');
service.getUniversityTeams = createQueryPromise('SELECT t.id AS id, t.name AS name, t.team_division_id AS team_division_id, p.name AS prefecture_name FROM team AS t INNER JOIN prefecture AS p ON t.prefecture_id = p.id WHERE t.team_division_id = 4');
service.getHighSchoolTeams = createQueryPromise('SELECT t.id AS id, t.name AS name, t.team_division_id AS team_division_id, p.name AS prefecture_name FROM team AS t INNER JOIN prefecture AS p ON t.prefecture_id = p.id WHERE t.team_division_id = 3');
service.getJuniorHighTeams = createQueryPromise('SELECT t.id AS id, t.name AS name, t.team_division_id AS team_division_id, p.name AS prefecture_name FROM team AS t INNER JOIN prefecture AS p ON t.prefecture_id = p.id WHERE t.team_division_id = 2');

service.getCompetitions = createQueryPromise('SELECT c.id AS id, c.name AS name, t.name AS tennis_court_name, c.date AS date, c.duration AS duration FROM competition AS c INNER JOIN tennis_court AS t WHERE t.id = c.tennis_court_id');
service.getMatches = createQueryPromise('SELECT * FROM soft_tennis_match');

service.getCompetitionById = function (connection, competitionId) {
    return createQueryPromise('SELECT * FROM competition WHERE ?', { id: competitionId }, true)(connection);
}

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

service.getPlayerById = function (connection, playerId) {
    return createQueryPromise('SELECT p.id AS id, p.name AS name, p.birth_year AS birth_year, p.is_lefty AS is_lefty, jh.id AS junior_high_team_id, jh.name AS junior_high_team_name, hs.id AS high_school_team_id, hs.name AS high_school_team_name, u.id AS university_team_id, u.name AS university_team_name, c.id AS current_team_id, c.name AS current_team_name FROM (((player AS p LEFT JOIN team AS jh ON jh.id = p.junior_high_team_id) LEFT JOIN team AS hs ON hs.id = p.high_school_team_id) LEFT JOIN team AS u ON u.id = p.university_team_id) LEFT JOIN team AS c ON c.id = p.current_team_id WHERE ?', { "p.id": playerId }, true)(connection);
};

service.getPlayersByBirthYear = function (connection, birthYear) {
    return createQueryPromise('SELECT p.id AS id, p.name AS name, t.id AS team_id, t.name AS team_name FROM player AS p INNER JOIN team AS t ON t.id = p.current_team_id WHERE ?', { birth_year: birthYear })(connection);
};

service.getMatchesByPlayerId = function (connection, playerId) {
    return createQueryPromise({
        sql: 'SELECT * FROM soft_tennis_match WHERE player1_id = ? OR player2_id = ? OR player3_id = ? OR player4_id = ?',
        values: [playerId, playerId, playerId, playerId]
    })(connection);
};

service.getMatchById = function (connection, matchId) {
    return createQueryPromise({
        sql: 'SELECT m.id AS id, m.title AS title, m.url AS url, m.date AS date, t.id AS tennis_court_id, t.name AS tennis_court_name, p1.id AS player1_id, p1.name AS player1_name, p2.id AS player2_id, p2.name AS player2_name, p3.id AS player3_id, p3.name AS player3_name, p4.id AS player4_id, p4.name AS player4_name FROM ((((soft_tennis_match AS m INNER JOIN player AS p1 ON p1.id = m.player1_id) INNER JOIN player AS p2 ON p2.id = m.player2_id) INNER JOIN player AS p3 ON p3.id = m.player3_id) INNER JOIN player AS p4 ON p4.id = m.player4_id) INNER JOIN tennis_court AS t ON t.id = m.tennis_court_id WHERE m.id = ?',
        values: [matchId]
    }, null, true)(connection);
};

module.exports = service;
