var inherits = require('inherits');
var ScalarField = require('./ScalarField');

var TextField = function (fieldName) {
  this.fieldName = fieldName;
};

inherits(TextField, ScalarField);

module.exports = TextField;