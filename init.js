var q              = require('q')
  , pg             = require('pg')
  , createDatabase = require('./createDatabase')
  , connection     = require('./connection')
  , server         = require('./server');

initDatabase().then(server);

function initDatabase () {
  var deferred = q.defer();
  pg.connect(connection, function(err, client, done) {

    if (err) { return console.error('DATABASE ERROR: ', err); }
    client.query('SELECT * FROM mafia;', function(err, result) {
      if (err && err.code === '42P01') { createDatabase(deferred.resolve); }
      else if (err) { return console.error('FATAL ERROR: ' + err); }
      else { deferred.resolve('FOUND A DATABASE'); }
    });
  });
  return deferred.promise;
}
