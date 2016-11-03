var _ = require('underscore');
var inherits = require('inherits');
var Logic = require('./Logic');

var Not = function (condition) {
  this.conditions = [condition]
};

Not.prototype.toConditionString = function () {
  var c = this.conditions[0];
  var result = ' NOT (';



  if (c instanceof Logic) {
    result = result + c.toConditionString();

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

  return result + ') ';
};

inherits(Not, Logic)


module.exports = Not;