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
    return createQueryPromise('SELECT p.id AS id, p.name AS name, p.birth_year AS birth_year, jh.id AS junior_high_team_id, jh.name AS junior_high_team_name, hs.id AS high_school_team_id, hs.name AS high_school_team_name, u.id AS university_team_id, u.name AS university_team_name, c.id AS current_team_id, c.name AS current_team_name FROM (((player AS p INNER JOIN team AS jh ON jh.id = p.junior_high_team_id) INNER JOIN team AS hs ON hs.id = p.high_school_team_id) INNER JOIN team AS u ON u.id = p.university_team_id) INNER JOIN team AS c ON c.id = p.current_team_id WHERE ?', { "p.id": playerId }, true)(connection);
};


module.exports = service;
