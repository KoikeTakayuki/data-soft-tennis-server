var _ = require('underscore');

var Logic = function () {

};

Logic.prototype.attachAlias = function (alias) {
  _.each(this.conditions, function (c) {
    if (c instanceof Logic) {
      c.attachAlias(alias);
    } else {
      _.each(c, function (value, key) {
        if (key.indexOf('.') === -1) {
          delete c[key];
          c[alias + '.' + key] = value;
        }
      })
    }
  });
};

Logic.prototype.attachForeignTableAlias = function (tableName, alias) {
  _.each(this.conditions, function (c) {
    if (c instanceof Logic) {
      c.attachForeignTableAlias(alias);
    } else {
      _.each(c, function (value, key) {
        if (key.indexOf('.') !== -1) {

          var table = key.split('.')[0];
          if (table === tableName) {
            delete c[key];
            c[alias + '.' + key] = value;
          }
        }
      })
    }
  });

};

module.exports = Logic;