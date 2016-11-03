var inherits = require('inherits');
var ScalarField = require('./ScalarField');

var NumberField = function (fieldName) {
  this.fieldName = fieldName;
};

inherits(NumberField, ScalarField);

module.exports = NumberField;