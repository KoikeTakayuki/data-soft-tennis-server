var RecordType = require('./rql/RecordType');
var TextField = require('./rql/field/TextField');
var NumberField = require('./rql/field/NumberField');
var RecordField = require('./rql/field/RecordField');
var BooleanField = require('./rql/field/BooleanField');
var DateField = require('./rql/field/DateField');

var createEnumerationTable = function (tableName) {
  return new RecordType(tableName, [
    new TextField('name'),
    new TextField('url_string'),
    new BooleanField('is_visible'),
  ]);
};

var RecordTypes = {};

RecordTypes.Prefecture = createEnumerationTable('prefecture');
RecordTypes.TeamDivision = createEnumerationTable('team_division');
RecordTypes.Round = createEnumerationTable('round');
RecordTypes.CourtSurface = createEnumerationTable('court_surface');
RecordTypes.Tactics = createEnumerationTable('tactics');
RecordTypes.CompetitionType = createEnumerationTable('competition_type');

RecordTypes.TennisCourt = new RecordType('tennis_court', [
  new TextField('name'),
  new TextField('url'),
  new TextField('phone_number'),
  new RecordField('court_surface', RecordTypes.CourtSurface),
  new RecordField('prefecture', RecordTypes.Prefecture),
  new TextField('address'),
  new NumberField('latitude'),
  new NumberField('longitude'),
  new BooleanField('is_visible')
]);

RecordTypes.Competition = new RecordType('competition', [
  new TextField('name'),
  new TextField('description'),
  new RecordField('tennis_court', RecordTypes.TennisCourt),
  new DateField('date'),
  new NumberField('duration'),
  new RecordField('competition_type', RecordTypes.CompetitionType),
  new BooleanField('is_visible')
]);

RecordTypes.Team = new RecordType('team', [
  new TextField('name'),
  new TextField('url_string'),
  new RecordField('prefecture', RecordTypes.Prefecture),
  new RecordField('team_division', RecordTypes.TeamDivision),
  new RecordField('parent_team', this),
  new BooleanField('is_visible'),
]);

RecordTypes.Player = new RecordType('player', [
  new TextField('name'),
  new TextField('profile'),
  new NumberField('birth_year'),
  new RecordField('gender'),
  new BooleanField('is_lefty'),
  new RecordField('junior_high_team', RecordTypes.Team),
  new RecordField('high_school_team', RecordTypes.Team),
  new RecordField('university_team', RecordTypes.Team),
  new RecordField('current_team', RecordTypes.Team),
  new BooleanField('is_visible'),
]);

RecordTypes.TeamMatch = new RecordType('team_match', [
  new RecordField('competition', RecordTypes.Competition),
  new RecordField('team1', RecordTypes.Team),
  new RecordField('team2', RecordTypes.Team),
  new BooleanField('is_team1_winner')
]);

RecordTypes.Match = new RecordType('soft_tennis_match', [
  new TextField('title'),
  new TextField('url'),
  new RecordField('competition', RecordTypes.Competition),
  new DateField('date'),
  new RecordField('round', RecordTypes.Round),
  new RecordField('tennis_court', RecordTypes.TennisCourt),
  new NumberField('max_game_count'),
  new RecordField('player1', RecordTypes.Player),
  new RecordField('player2', RecordTypes.Player),
  new RecordField('player3', RecordTypes.Player),
  new RecordField('player4', RecordTypes.Player),
  new RecordField('tactics_a', RecordTypes.Tactics),
  new RecordField('tactics_b', RecordTypes.Tactics),
  new BooleanField('is_singles'),
  new BooleanField('is_side_a_winner'),
  new RecordField('team_match', RecordTypes.TeamMatch),
  new NumberField('team_match_count'),
  new RecordField('previous_match', this),
  new RecordField('next_match', this),
  new BooleanField('is_visible')
]);


module.exports = RecordTypes;