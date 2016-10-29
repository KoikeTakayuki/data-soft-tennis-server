var service = {};

var createQueryPromise = function(query, data, getOnlyFirst) {

    return function(connection) {

        return new Promise(function(success, failure) {

            var callback = function(err, result) {

                if (err) {
                    throw err;
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

service.getPlayers = createQueryPromise('SELECT p.id AS id, p.name AS name, p.birth_year AS birth_year, t.name AS team_name FROM player AS p INNER JOIN team AS t ON t.id = p.current_team_id');
module.exports = service;
