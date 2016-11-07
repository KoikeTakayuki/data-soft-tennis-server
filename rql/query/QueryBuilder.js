var ScalarField = require('../field/ScalarField');
var RecordField = require('../field/RecordField');
var _ = require('underscore');

var uniquerId = 0;

var QueryBuilder = function(recordType) {
  var aliasMapping = {};

  this.recordType = recordType;

  this.getAliasMapping = function () {
    return function (key) {
      var result = key;

      _.each(aliasMapping, function (v, k) {
        if (key.indexOf(k + '__') !== -1) {
          result = v;
        }
      });
      
      return result;
    };
  };

  this.setAliasMapping = function (key, alias) {
    aliasMapping[key] = alias;
  }
};

var makeAlias = function (tableName) {
  ++uniquerId;
  if (uniquerId > 1000) {
    uniquerId = uniquerId - 1000;
  }

  return tableName + uniquerId;
};

var getFieldName = function(field) {
  return field.fieldName;
};

var attachAlias = function (aliasedTableName, isForeignTable) {
  return function (string) {
    if (isForeignTable) {
      return aliasedTableName + '.' + string + ' AS ' + aliasedTableName + '__' + string;
    }
    return aliasedTableName + '.' + string + ' AS ' + string;
  }
};

QueryBuilder.prototype.buildQuery = function (condition, eagerRecordFields, orderFields, count) {
  var aliasedTableName = makeAlias(this.recordType.tableName);
  var tableDeclaration = this.recordType.tableName + ' AS ' + aliasedTableName;
  var fieldDeclaration = this.recordType.getScalarFields().map(getFieldName).map(attachAlias(aliasedTableName));
  condition.attachAlias(aliasedTableName);

  var that = this;

  this.recordType.getRecordFields().forEach(function (rf) {
    if (_.contains(eagerRecordFields, rf.fieldName)) {
      var recordType = rf.recordType;
      var foreignTableName = makeAlias(recordType.tableName);

      condition.attachForeignTableAlias(rf.fieldName, foreignTableName);

      that.setAliasMapping(foreignTableName, rf.fieldName);
      tableDeclaration = tableDeclaration + ' LEFT JOIN ' + recordType.tableName + ' AS ' + foreignTableName + ' ON ' + aliasedTableName + '.' + rf.fieldName + '_id = ' + foreignTableName + '.id';
      fieldDeclaration = fieldDeclaration + ', ' + recordType.getScalarFields().map(getFieldName).map(attachAlias(foreignTableName, true));
    }
  });

  var query = 'SELECT ' + fieldDeclaration + ' FROM ' + tableDeclaration;


  var conditionDeclaration = condition.toConditionString();
  if (conditionDeclaration.length > 0) {
    query = query + ' WHERE ' + conditionDeclaration;
  }

  if (_.isArray(orderFields)) {

    query += ' ORDER BY ';
    _.each(orderFields, function (v, i) {

      if (i > 0) {
        query += ', ';
      }
      query += v.field + ' ' + (v.asc ? "ASC " : "DESC ");
    });
  }

  if (_.isNumber(count)) {
    query += ' LIMIT ' + count;
  }

  return query;
};

module.exports = QueryBuilder;