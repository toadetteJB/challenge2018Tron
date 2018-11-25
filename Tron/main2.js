const Coordonnee = require('./Coordonnee');
const Artefact = require('./Artefact');
const Lumicycle = require('./Lumicycle');
const Configuration = require('./Configuration');
const Game = require('./Game');
const Jeu_donnees = require('./Jeu_donnees');

const json = Jeu_donnees.json1;
//let json = {"artefacts":[{"type":"R","x":5,"y":12},{"type":"M","x":11,"y":11},{"type":"M","x":13,"y":8},{"type":"M","x":16,"y":11},{"type":"M","x":18,"y":8},{"type":"R","x":24,"y":7}],"lumicycles":[{"joueur":1,"points":[{"x":14,"y":15},{"x":13,"y":15},{"x":12,"y":15},{"x":11,"y":15},{"x":10,"y":15},{"x":9,"y":15},{"x":8,"y":15},{"x":7,"y":15},{"x":6,"y":15},{"x":5,"y":15},{"x":4,"y":15},{"x":4,"y":16}],"artefacts":[]},{"joueur":2,"points":[{"x":15,"y":4},{"x":14,"y":4},{"x":13,"y":4},{"x":12,"y":4},{"x":11,"y":4},{"x":10,"y":4},{"x":9,"y":4},{"x":8,"y":4},{"x":7,"y":4},{"x":7,"y":5},{"x":7,"y":6},{"x":7,"y":7}],"artefacts":[]},{"joueur":1,"points":[{"x":6,"y":4},{"x":6,"y":5},{"x":6,"y":6},{"x":5,"y":6},{"x":5,"y":7},{"x":5,"y":8},{"x":5,"y":9},{"x":5,"y":10},{"x":4,"y":10},{"x":4,"y":11},{"x":3,"y":11},{"x":3,"y":12}],"artefacts":[]},{"joueur":2,"points":[{"x":23,"y":15},{"x":22,"y":15},{"x":21,"y":15},{"x":20,"y":15},{"x":19,"y":15},{"x":18,"y":15},{"x":17,"y":15},{"x":16,"y":15},{"x":15,"y":15},{"x":15,"y":16},{"x":14,"y":16},{"x":13,"y":16}],"artefacts":[]}],"config":{"id":39,"tour":12,"maxX":30,"maxY":20,"nbJoueurs":2,"nbVehicules":2}};

// test arcs
/*
json = {"artefacts":[],
"lumicycles":[
    {"joueur":2,"points":[{"x":0,"y":3}],"artefacts":[]},
    {"joueur":2,"points":[{"x":2,"y":3}],"artefacts":[]},
    {"joueur":1,"points":[{"x":1,"y":0},{"x":2,"y":0}],"artefacts":[]},
    {"joueur":1,"points":[{"x":4,"y":1}],"artefacts":[]}
],
"config":{"id":39,"tour":12,"maxX":5,"maxY":4,"nbJoueurs":2,"nbVehicules":2}};
*/
/*
json = {"artefacts":[
    {"type":"R","x":5,"y":12},{"type":"M","x":11,"y":11},{"type":"M","x":13,"y":8},
    {"type":"M","x":16,"y":11},{"type":"M","x":18,"y":8},{"type":"R","x":24,"y":7},
    {"type":"M","x":7,"y":4},{"type":"M","x":8,"y":4},{"type":"M","x":9,"y":4},
    {"type":"M","x":10,"y":4},{"type":"M","x":9,"y":3},{"type":"M","x":10,"y":3},{"type":"M","x":8,"y":2},
    {"type":"M","x":9,"y":2},{"type":"M","x":10,"y":2},{"type":"M","x":8,"y":1},{"type":"M","x":9,"y":1},
    {"type":"M","x":10,"y":1},{"type":"M","x":6,"y":0}
],
"lumicycles":[
    {"joueur":2,"points":[{"x":0,"y":3},{"x":1,"y":3},{"x":2,"y":3},{"x":3,"y":3}],"artefacts":[]},
    {"joueur":2,"points":[{"x":3,"y":4},{"x":4,"y":4},{"x":5,"y":4},{"x":6,"y":4},{"x":6,"y":3},{"x":7,"y":3},{"x":8,"y":3}],"artefacts":[]},
    {"joueur":1,"points":[{"x":2,"y":2},{"x":3,"y":2},{"x":4,"y":2},{"x":4,"y":1},{"x":5,"y":1},{"x":6,"y":1},{"x":6,"y":2}],"artefacts":[]},
    {"joueur":1,"points":[{"x":23,"y":15}],"artefacts":[]}
],
"config":{"id":39,"tour":12,"maxX":30,"maxY":20,"nbJoueurs":2,"nbVehicules":2}};
*/

//json = {"artefacts":[{"type":"M","x":11,"y":10},{"type":"M","x":13,"y":10},{"type":"M","x":16,"y":9},{"type":"P","x":18,"y":6},{"type":"M","x":18,"y":9}],"lumicycles":[{"joueur":1,"points":[{"x":19,"y":16},{"x":18,"y":16},{"x":17,"y":16},{"x":16,"y":16},{"x":15,"y":16},{"x":14,"y":16},{"x":13,"y":16},{"x":12,"y":16},{"x":12,"y":15},{"x":11,"y":15},{"x":10,"y":15},{"x":10,"y":14},{"x":10,"y":13},{"x":10,"y":12},{"x":10,"y":11},{"x":10,"y":10},{"x":10,"y":9},{"x":10,"y":8},{"x":11,"y":8},{"x":11,"y":7},{"x":12,"y":7}],"artefacts":[]},{"joueur":2,"points":[{"x":10,"y":3},{"x":9,"y":3},{"x":8,"y":3},{"x":7,"y":3},{"x":6,"y":3},{"x":5,"y":3},{"x":5,"y":2},{"x":5,"y":1},{"x":5,"y":0},{"x":4,"y":0},{"x":4,"y":1},{"x":4,"y":2},{"x":4,"y":3},{"x":3,"y":3},{"x":3,"y":4},{"x":3,"y":5},{"x":3,"y":6},{"x":3,"y":7},{"x":3,"y":8},{"x":3,"y":9},{"x":3,"y":10}],"artefacts":[]},{"joueur":1,"points":[{"x":7,"y":7},{"x":7,"y":8},{"x":7,"y":9},{"x":7,"y":10},{"x":7,"y":11},{"x":7,"y":12},{"x":7,"y":13},{"x":7,"y":14},{"x":7,"y":15},{"x":6,"y":15},{"x":5,"y":15},{"x":4,"y":15},{"x":4,"y":16},{"x":3,"y":16},{"x":3,"y":17},{"x":4,"y":17},{"x":5,"y":17},{"x":6,"y":17},{"x":7,"y":17},{"x":8,"y":17},{"x":9,"y":17}],"artefacts":[]},{"joueur":1,"points":[{"x":7,"y":4},{"x":6,"y":4},{"x":5,"y":4},{"x":4,"y":4},{"x":4,"y":5},{"x":4,"y":6},{"x":4,"y":7},{"x":4,"y":8},{"x":4,"y":9},{"x":4,"y":10},{"x":4,"y":11},{"x":3,"y":11},{"x":3,"y":12},{"x":3,"y":13},{"x":4,"y":13},{"x":5,"y":13},{"x":5,"y":12},{"x":5,"y":11},{"x":5,"y":10},{"x":6,"y":10},{"x":6,"y":9}],"artefacts":[]}],"config":{"id":60,"tour":22,"maxX":30,"maxY":20,"nbJoueurs":2,"nbVehicules":3}};

const artefacts = json.artefacts.map(art => new Artefact(art.type, new Coordonnee(art.x, art.y)));
  const lumicycles = json.lumicycles.map(lum => {
      const points = lum.points.map(p => new Coordonnee(p.x, p.y));
      return new Lumicycle(lum.joueur, points, []);
  });
  const config = new Configuration(json.config.id,json.config.tour,json.config.maxX,
      json.config.maxY, json.config.nbJoueurs, json.config.nbVehicules);

  const game = new Game(artefacts, lumicycles, config);
  if(process.env.DEBUG)
    console.log("Tour: "+game.config.tour);
  let direction = game.determineDirection();
  if(process.env.DEBUG)
  {
    console.log(direction);
    game.afficheGrille();
  }
  