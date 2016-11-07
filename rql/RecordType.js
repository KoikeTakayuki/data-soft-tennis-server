var ScalarField = require('./field/ScalarField');
var RecordField = require('./field/RecordField');
var NumberField = require('./field/NumberField');
var QueryBuilder = require('./query/QueryBuilder');
var Logic = require('./logic/Logic');
var Or = require('./logic/Or');
var _ = require('underscore');

var RecordType = function (tableName, fields, parentClass) {

  var uniqueId = 0;
  var idField = new NumberField('id');

  this.tableName = tableName;
  this.fields = [idField].concat(fields);
  this.parentClass = parentClass;
};

var constructQueryResult = function (object, aliasMapping) {

  var result = {};

  _.each(object, function (value, key) {
    if (key.indexOf('__') !== -1) {
      var tableName = aliasMapping(key);
      var fieldName = key.split('__')[1];

      if (!result[tableName]) {
        result[tableName] = {};
      }

      result[tableName][fieldName] = value;
    } else {
      result[key] = value;
    }
  });

  return result;
};

RecordType.prototype.getScalarFields = function () {
  return this.fields.filter(function (f) {
    return (f instanceof ScalarField);
  });
}

RecordType.prototype.getRecordFields = function () {
  return this.fields.filter(function (f) {
    return (f instanceof RecordField);
  });
}

RecordType.prototype.all = function (connection, condition, eagerRecordFields, orderFields, count, offset) {
  if (!eagerRecordFields) {
    eagerRecordFields = [];
  }

  if (!(condition instanceof Logic)) {
    condition = new Or(condition);
  }

  var that = this;

  return new Promise(function (success, failure) {

    queryBuilder = new QueryBuilder(that);
    query = queryBuilder.buildQuery(condition, eagerRecordFields, orderFields, count, offset);

    var aliasMapping = queryBuilder.getAliasMapping();

    var callBack = function (err, queryResult) {
      if (err) {
        failure(err);
      } else {

        if (_.isArray(queryResult)) {
          success(queryResult.map(function (r) {
            return constructQueryResult(r, aliasMapping);
          }));
        } else {
          success(constructQueryResult(queryResult, aliasMapping));
        }

      }
    };

    connection.query(query, callBack);
  });
};

RecordType.prototype.first = function (connection, condition, eagerRecordFields, orderFields) {
  return this.all(connection, condition, eagerRecordFields, orderFields, 1).then(function (result) {
    return result[0];
  });
};




module.exports = RecordType;