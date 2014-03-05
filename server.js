var express = require('express')
  , app     = express()
  , mafia   = require('./mafia')
  , port    = process.argv[2] || 8888
  , defined = require('./defined');

app.use(express.static(__dirname + '/public'))
   .use(express.bodyParser());

// curl http://localhost:8888/mafia/1
app.get('/mafia/:id', function(req, res) {
  console.log('LOOKING UP MAFIOSO ' + req.params.id);
  mafia.lookup(req.params.id, res);
});

// curl http://localhost:8888/mafia/dons
app.get('/maffia/dons', function(req, res) {
  console.log('dons');
  mafia.lookupDons(res);
});

// curl -X PUT -d "free=false" http://localhost:8888/mafia/1
app.put('/mafia/:id', function(req, res) {
  console.log('UPDATING');
  var body;
  if (req.body) {
    body = req.body;
    if (/*defined(body.boss) || defined(body.free) || defined(body.alive) || defined(body.crew)*/ true) {
      if (body.crew) { console.log(typeof body.crew); }
      mafia.update(req.params.id, body, res);
      console.log('after update;');
    }
    else { badPost(res); }
  }
  else { badPost(res); }
});

// curl -X POST -d "name=Corleone&age=53&crew=[1,2]&boss=0" http://localhost:8888/mafia
app.post('/mafia', function(req, res) {
  console.log('CREATING');
  var body;
  if (req.body) {
    body = req.body;
    console.log(body);
    if (body.name && body.age && body.crew && body.boss) {
      mafia.create(body, res);
    }
    else {
      console.log('unspecified attribute on body');
      badPost(res);
    }
  }
  else {
    console.log('no body');
    badPost(res);
  }
});

// curl http://localhost:8888/mafia
app.get('/mafia', function(req,res) {
  console.log('GETTING MAFIA HIERARCHY');
  mafia.all(res);
});

module.exports = function() {
  console.log('LISTENING TO ' + port);
  app.listen(port);
};

function parseArrayString(arrayString) {
  return arrayString.replace('[', '').replace(']','').split(',')
}

function badPost (res) {
  res.send(400)
}
