
  /* ====================== *
   *                        *
   *      MEMBER MODEL      *
   *                        *
   *     NAME  :  String    *
   *     AGE   :  Number    *
   *     CREW  :  Number[]  *
   *     BOSS  :  Number    *
   *     ID    :  Number    *
   *     FREE  :  Boolean   *
   *     ALIVE :  Boolean   *
   *                        *
   * ====================== */

var pg        = require('pg')
 , connection = require('./connection')
 , organize   = require('./organization')
 , defined    = require('./defined');

exports.lookup = function(id, res) {
  // SELECT * FROM mafia WHERE id='1';
  var queryString = 'SELECT * FROM mafia WHERE id=\'' +  id + '\';';
  execute(queryString, function(message) { res.send(message); });
};

exports.create = function(mafioso, res) {
  var queryString = (
    'INSERT INTO mafia (name, age, crew, boss) VALUES (\'' +
      mafioso.name             + '\', \'' +
      mafioso.age              + '\', \'' +
      crewString(mafioso.crew) + '\', \'' +
      mafioso.boss             + '\') RETURNING *;'
  );
  execute(queryString, function(message) {
    res.send(message);
    updateCrew(mafioso.boss, message[0].id);
  });
};

exports.lookupDons = function(res) {

};

exports.update = function(id, attributes, res) {
  // (body.boss || body.free || body.alive || body.crew)
  var queryStringArr = ['UPDATE mafia SET']
    , keys = Object.keys(attributes)
    , queryString;

  // changes in crew org should only occur via updates to
  //  freedom / life I've created the ability to do it via
  // PUT to crew as a utility to help me build
  if (attributes.crew) {
    console.error('MANUAL UPDATE OF CREW');
    attributes.crew = crewString(attributes.crew);
  }
  if (attributes.boss) { console.error('MANUAL UPDATE OF BOSS'); }

  for (var i = 0; i < keys.length; i++) {
    queryStringArr.push( ' ' + keys[i] + '=\'' + attributes[keys[i]] + '\'' );
    if (i !== keys.length - 1) { queryStringArr.push(','); }
  }
  queryStringArr.push(' WHERE id=\'' + id + '\' RETURNING *;');
  queryString = queryStringArr.join('');

  execute(queryString, function(mafioso) {
    console.log('callback from PG')
    res.send(mafioso);
    console.log(attributes);
    if (defined(attributes.boss) || defined(attributes.alive) || defined(attributes.free) || defined(attributes.alive)) {
      organizationChange(mafioso, attributes);
    }
  });
};

exports.all = function(res) {
  execute('SELECT * FROM mafia', function(results) { res.send(organize(results)); });
};

function organizationChange (mafioso, attributes) {
  console.log('CHANGE TO THE ORG');
  console.log(attributes, "AFTER")
  console.log(attributes.free !== 'true' && defined(attributes.free));
  if (attributes.free !== 'true' && defined(attributes.free)) {
    console.log('DUE TO JAIL');
    var crew = mafioso[0].crew;
    console.log(typeof crew);
    for (var i = 0; i < crew.length; i++) {
      console.log(crew[i]);
    }
  }
  else if (attributes.alive !== 'true' && defined(attributes.alive)) {
    console.log('DUE TO DEATH');
  }
}

function updateCrew (bossID, memberID) {
  if(bossID) {
    var queryString = 'UPDATE mafia SET crew = crew || ' + memberID + ' WHERE id=' + bossID + ' RETURNING *;';
    execute(queryString, function(record) { console.log(record); });
  }
}

function crewString (crew) {
  return crew.replace('[','{').replace(']','}');
}

function execute (queryString, callback, response) {
  var result = [];
  pg.connect(connection, function(err, client, done) {
    if (err) { return console.error('DATABASE ERROR: ', err); }
    var query = client.query(queryString);

    query.on('error', function (err) { console.error('DATABASE ERROR:', err); });
    query.on('row',   function (row) { result.push(row); });
    query.on('end',   function (   ) {
      if (result.length) { callback(result, response); }
      else { callback(404); }
      done();
    });
  });
}
