var inherits = require('inherits');
var ScalarField = require('./ScalarField');

var BooleanField = function (fieldName) {
  this.fieldName = fieldName;
};

inherits(BooleanField, ScalarField);

module.exports = BooleanField;