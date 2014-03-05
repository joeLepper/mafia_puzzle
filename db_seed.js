var membersCount = process.argv[2]
  , needle       = require('needle')
  , moniker      = require('moniker');

for (var i = 0; i < membersCount; i++) {
  var age  = Math.floor(Math.random() * 75)
    , name = moniker.choose()
    , boss = Math.floor(Math.random() * i);

  console.log('iteration: ', i);
  console.log('boss: ', boss);

  var queryString = 'age=' + age+ '&name=' + name + '&boss=' + boss + '&crew=[]' + '&iteration=' + i;
  console.log(queryString)
  needle.post('http://localhost:8888/mafia', queryString, function(err,res,body) {

    console.log(body);
  });
}