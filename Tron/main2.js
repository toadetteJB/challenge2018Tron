const Coordonnee = require('./Coordonnee');
const Artefact = require('./Artefact');
const Lumicycle = require('./Lumicycle');
const Configuration = require('./Configuration');
const Game = require('./Game');
let json = {"artefacts":[{"type":"R","x":5,"y":12},{"type":"M","x":11,"y":11},{"type":"M","x":13,"y":8},{"type":"M","x":16,"y":11},{"type":"M","x":18,"y":8},{"type":"R","x":24,"y":7}],"lumicycles":[{"joueur":1,"points":[{"x":14,"y":15},{"x":13,"y":15},{"x":12,"y":15},{"x":11,"y":15},{"x":10,"y":15},{"x":9,"y":15},{"x":8,"y":15},{"x":7,"y":15},{"x":6,"y":15},{"x":5,"y":15},{"x":4,"y":15},{"x":4,"y":16}],"artefacts":[]},{"joueur":2,"points":[{"x":15,"y":4},{"x":14,"y":4},{"x":13,"y":4},{"x":12,"y":4},{"x":11,"y":4},{"x":10,"y":4},{"x":9,"y":4},{"x":8,"y":4},{"x":7,"y":4},{"x":7,"y":5},{"x":7,"y":6},{"x":7,"y":7}],"artefacts":[]},{"joueur":1,"points":[{"x":6,"y":4},{"x":6,"y":5},{"x":6,"y":6},{"x":5,"y":6},{"x":5,"y":7},{"x":5,"y":8},{"x":5,"y":9},{"x":5,"y":10},{"x":4,"y":10},{"x":4,"y":11},{"x":3,"y":11},{"x":3,"y":12}],"artefacts":[]},{"joueur":2,"points":[{"x":23,"y":15},{"x":22,"y":15},{"x":21,"y":15},{"x":20,"y":15},{"x":19,"y":15},{"x":18,"y":15},{"x":17,"y":15},{"x":16,"y":15},{"x":15,"y":15},{"x":15,"y":16},{"x":14,"y":16},{"x":13,"y":16}],"artefacts":[]}],"config":{"id":39,"tour":12,"maxX":30,"maxY":20,"nbJoueurs":2,"nbVehicules":2}};

const artefacts = json.artefacts.map(art => new Artefact(art.type, new Coordonnee(art.x, art.y)));
  const lumicycles = json.lumicycles.map(lum => {
      const points = lum.points.map(p => new Coordonnee(p.x, p.y));
      return new Lumicycle(lum.joueur, points, []);
  });
  const config = new Configuration(json.config.id,json.config.tour,json.config.maxX,
      json.config.maxY, json.config.nbJoueurs, json.config.nbVehicules);

  const game = new Game(artefacts, lumicycles, config);
  console.log("Tour: "+game.config.tour);
  game.calculCasesInterdites();
  let direction = game.determineDirection();

  console.log(direction);
  game.afficheGrille();