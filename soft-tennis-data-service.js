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

service.getPlayers = createQueryPromise('SELECT * FROM player');
module.exports = service;
