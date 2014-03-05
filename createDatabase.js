var pg         = require('pg')
  , connection = require('./connection');

module.exports = function (callback) {
  var client = new pg.Client(connection);
  client.connect();

  /* ---- MEMBER MODEL ---- *
   *                        *
   *     NAME  :  String    *
   *     AGE   :  Number    *
   *     CREW  :  Number[]  *
   *     BOSS  :  Number    *
   *     ID    :  Number    *
   *     FREE  :  Boolean   *
   *     ALIVE :  Boolean   *
   *     LEVEL :  Number    *
   *                        *
   * ---------------------- */

  query = client.query(
    'CREATE TABLE mafia ( '              +
      'name   text       NOT NULL, '     +
      'age    smallint   NOT NULL, '     +
      'crew   integer[], '               +
      'boss   integer    NOT NULL, '     +
      'id     SERIAL     primary key, '  +
      'alive  boolean    DEFAULT True, ' +
      'level  integer, '                 +
      'free   boolean    DEFAULT True);'
  );
  query.on('end', function() {
    callback('CREATED!');
    client.end();
  } );
};
