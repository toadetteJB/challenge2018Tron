const Coordonnee = require('./Coordonnee');
const Artefact = require('./Artefact');
const Lumicycle = require('./Lumicycle');
const Configuration = require('./Configuration');
const Game = require('./Game');

// init project
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// http://expressjs.com/en/starter/basic-routing.html
app.post('/', function(request, response) {
  let json = request.body;
  console.log(JSON.stringify(json));
  const artefacts = json.artefacts.map(art => new Artefact(art.type, new Coordonnee(art.x, art.y)));
  const lumicycles = json.lumicycles.map(lum => {
      const points = lum.points.map(p => new Coordonnee(p.x, p.y));
      return new Lumicycle(lum.joueur, points, []);
  });
  const config = new Configuration(json.config.id,json.config.tour,json.config.maxX,
      json.config.maxY, json.config.nbJoueurs, json.config.nbVehicules);

  const game = new Game(artefacts, lumicycles, config);
  
  console.log("Tour: "+game.config.tour);
  game.afficheGrille();
  let direction = game.determineDirection();
  console.log(direction);
  console.log("******************************************************************");
  response.json(direction);
});

// listen for requests :)
var listener = app.listen(8000, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
