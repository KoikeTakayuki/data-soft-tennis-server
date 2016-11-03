var inherits = require('inherits');
var ScalarField = require('./ScalarField');

var DateField = function (fieldName) {
  this.fieldName = fieldName;
};

inherits(DateField, ScalarField);

module.exports = DateField;