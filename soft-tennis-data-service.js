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

service.getCompetitions = createQueryPromise('SELECT c.id AS id, c.name AS name, t.name AS tennis_court_name FROM competition AS c INNER JOIN tennis_court AS t WHERE t.id = c.tennis_court_id');
service.getMatches = createQueryPromise('SELECT * FROM soft_tennis_match');

module.exports = service;
