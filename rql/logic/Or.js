var _ = require('underscore');
var inherits = require('inherits');
var Logic = require('./Logic');

var Or = function (conditions) {
  this.conditions = _.toArray(arguments);
};

Or.prototype.toConditionString = function () {
  var result = '';
  _.each(this.conditions, function (c, index) {
    if (index > 0) {
      result += ' OR ';
    }
    if (c instanceof Logic) {
      result = result + ' (' + c.toConditionString() + ') ';

    } else {
      var isFirst = true;
      _.each(c, function (value, key) {
        if (!isFirst) {
          result += ' OR ';
        } else {
          isFirst = false;
        }
        result = result + key + ' = ' + value;
      });

    }
  });

  return result;
};

inherits(Or, Logic)

module.exports = Or;