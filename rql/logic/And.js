var _ = require('underscore');
var inherits = require('inherits');
var Logic = require('./Logic');
var Or = require('./Or');

var And = function () {
  this.conditions = _.toArray(arguments);
};

And.prototype.toConditionString = function () {
  var result = '';
  _.each(this.conditions, function (c, index) {
    if (index > 0) {
      result += ' AND ';
    }
    if (c instanceof Logic) {
      result = result + ' (' + c.toConditionString() + ') ';

    } else {
      var isFirst = true;
      _.each(c, function (value, key) {
        if (!isFirst) {
          result += ' AND ';
        } else {
          isFirst = false;
        }
        result = result + key + ' = ' + value;
      });
    }
  });

  return result;
};

inherits(And, Logic)


module.exports = And;