let json = {"artefacts":[{"type":"R","x":5,"y":12},{"type":"M","x":11,"y":11},{"type":"M","x":13,"y":8},{"type":"M","x":16,"y":11},{"type":"M","x":18,"y":8},{"type":"R","x":24,"y":7}],"lumicycles":[{"joueur":1,"points":[{"x":14,"y":15},{"x":13,"y":15},{"x":12,"y":15},{"x":11,"y":15},{"x":10,"y":15},{"x":9,"y":15},{"x":8,"y":15},{"x":7,"y":15},{"x":6,"y":15},{"x":5,"y":15},{"x":4,"y":15},{"x":4,"y":16}],"artefacts":[]},{"joueur":2,"points":[{"x":15,"y":4},{"x":14,"y":4},{"x":13,"y":4},{"x":12,"y":4},{"x":11,"y":4},{"x":10,"y":4},{"x":9,"y":4},{"x":8,"y":4},{"x":7,"y":4},{"x":7,"y":5},{"x":7,"y":6},{"x":7,"y":7}],"artefacts":[]},{"joueur":1,"points":[{"x":6,"y":4},{"x":6,"y":5},{"x":6,"y":6},{"x":5,"y":6},{"x":5,"y":7},{"x":5,"y":8},{"x":5,"y":9},{"x":5,"y":10},{"x":4,"y":10},{"x":4,"y":11},{"x":3,"y":11},{"x":3,"y":12}],"artefacts":[]},{"joueur":2,"points":[{"x":23,"y":15},{"x":22,"y":15},{"x":21,"y":15},{"x":20,"y":15},{"x":19,"y":15},{"x":18,"y":15},{"x":17,"y":15},{"x":16,"y":15},{"x":15,"y":15},{"x":15,"y":16},{"x":14,"y":16},{"x":13,"y":16}],"artefacts":[]}],"config":{"id":39,"tour":12,"maxX":30,"maxY":20,"nbJoueurs":2,"nbVehicules":2}};
// server.js
'use strict';

const  Direction = {
    UP: 1,
    DOWN: -1,
    LEFT: -1,
    RIGHT: 1
  };

const NIVEAU_MAX = 5;

class Coordonnee {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }    
}

class Artefact {
    constructor(type, coordonnee){
        this.type = type;
        this.coordonnee = coordonnee;
    }
}

class Lumicycle {
    constructor(joueur, points, artefacts) {
        this.joueur = joueur;
        this.points = points;
        this.artefacts = artefacts;
    }

    getTete() {
        return this.points[this.points.length -1];
    }
}

class Configuration {
    constructor (id, tour, maxX, maxY, nbJoueurs, nbVehicules) {
        this.id = id
        this.tour = tour;
        this.maxX = maxX;
        this.maxY = maxY;
        this.nbJoueurs = nbJoueurs;
        this.nbVehicules = nbVehicules;
    }
}

class Game {
    constructor(artefacts, lumicycles, config) {
        this.artefacts = artefacts;
        this.lumicycles = lumicycles;
        this.config = config;
        this.casesInterdites = [];
    }

    getJoueur1() {
        return this.lumicycles.filter(lum => lum.joueur == 1);
    }
  
    getJoueur2() {
        return this.lumicycles.filter(lum => lum.joueur == 2);
    }

    /**
     * Recherche des cases interdites
     * - artefacts "M"
     * - cases des lumicycles
     */
    calculCasesInterdites() {
        // Recherche des cases murs "M"
        this.artefacts.forEach(element => {
            if(element.type === 'M') {
                this.casesInterdites.push(element.coordonnee);
            }
        });

        // Cases occupées par les lumicycles
        this.lumicycles.forEach(lumicycle => {            
            this.casesInterdites = this.casesInterdites.concat(lumicycle.points);
        });
        //console.log("this.casesInterdites:",this.casesInterdites);
      
    }

    /**
     * Est vrai si la case est hors des limites du jeu
     * @param {Coordonnee} coord 
     */
    estHorsLimite(coord)
    {
       return coord.x < 0 || coord.x >= this.config.maxX
        || coord.y < 0 || coord.y >= this.config.maxY;
    }

    /**
     * Est vrai si la case appartient aux cases interdites
     * @param {Coordonnee} coord 
     */
    estCaseInterdite(coord) {
        const trouve = this.casesInterdites.find(function(element) {
            return element.x === coord.x && element.y === coord.y;
          });

        return trouve !== undefined;
    }

    /**
     * Est vrai si la case est hors limite ou si c'est une case interdite
     * @param {Coordonnee} coord 
     */
    estCaseDangereuse(coord)
    {
        //console.log(coord,this.estHorsLimite(coord), this.estCaseInterdite(coord));
        return this.estHorsLimite(coord) || this.estCaseInterdite(coord);
    }

    /**
     * Calcule le nombre de cases dangereuses sur la ligne
     * @param {Coordonnee} coord 
     * @param {int} niveau 
     * @param {Direction} direction 
     * @param {int} coeff
     */
    checkLigne(coord, niveau, direction, coeff)
    {
        let dangerosite = 0;
        let coeff_revise = -niveau;
        const y = coord.y + (direction * niveau);
        for(let x = coord.x - niveau ; x <= coord.x + niveau; x++)
        {
            const c = new Coordonnee(x, y);
            if(this.estCaseDangereuse({x,y}))
                dangerosite += fibonacci((coeff + this.getCoeffIsTeteAdverse(c)) - Math.abs(coeff_revise));
            coeff_revise++;
        }
        return dangerosite;
    }

    /**
     * Calcule le nombre de cases dangereuses sur la colonne
     * @param {Coordonnee} coord 
     * @param {int} niveau 
     * @param {Direction} direction 
     * @param {int} coeff
     */
    checkColonne(coord, niveau, direction, coeff)
    {
        let dangerosite = 0;
        let coeff_revise = -niveau;
        const x = coord.x + (direction * niveau);
        for(let y = coord.y - niveau ; y <= coord.y + niveau; y++)
        {
            const c = new Coordonnee(x, y);
            if(this.estCaseDangereuse(c))
            {
                dangerosite += fibonacci((coeff + this.getCoeffIsTeteAdverse(c)) - Math.abs(coeff_revise));
            }
            coeff_revise++;
        }
        return dangerosite;
    }
  
    getCoeffIsTeteAdverse(coord) {
        let coeffTete = 0;
        this.lumicycles.forEach(lum => {
            if(coord.x == lum.getTete().x 
                && coord.y == lum.getTete().y)
                coeffTete = 3;
        });

        return coeffTete;
    }

    /**
     * Détermine une valeur de dangerosite d'une case adjacente
     * @param {Coordonnee} coord 
     */
    dangerositeImmediate(coord)
    {        
        if(this.estCaseDangereuse(coord))
            return 9999;
        else
            return 0;
    }

    /**
     * Determine la position à jouer
     */
    determineDirection() {
        let listDirection = [];
        this.getJoueur1().forEach(J1 => {
            const coordJ1 = J1.getTete();
            let dangerositeU = 0;
            let dangerositeD = 0;
            let dangerositeL = 0;
            let dangerositeR = 0;

            let coeff = NIVEAU_MAX + 3;

            for(let n = 1; n <= NIVEAU_MAX; n++)
            {
                dangerositeU += this.checkLigne(coordJ1, n, Direction.UP, coeff);
                dangerositeD += this.checkLigne(coordJ1, n, Direction.DOWN, coeff);
                dangerositeL += this.checkColonne(coordJ1, n, Direction.LEFT, coeff);
                dangerositeR += this.checkColonne(coordJ1, n, Direction.RIGHT, coeff);

                coeff--;
            }

            const listeDirDang = [
                {dir: Direction.UP, dang: dangerositeU + this.dangerositeImmediate({x: coordJ1.x, y: coordJ1.y + 1}), text: "UP"},
                {dir: Direction.DOWN, dang: dangerositeD + this.dangerositeImmediate({x: coordJ1.x, y: coordJ1.y - 1}), text: "DOWN"},
                {dir: Direction.LEFT, dang: dangerositeL + this.dangerositeImmediate({x: coordJ1.x - 1, y: coordJ1.y}), text: "LEFT"},
                {dir: Direction.RIGHT, dang: dangerositeR + this.dangerositeImmediate({x: coordJ1.x + 1, y: coordJ1.y}), text: "RIGHT"}
            ];

            listeDirDang.sort((objA, objB) => objA.dang - objB.dang);
            //console.log(listeDirDang);
            listDirection.push(listeDirDang[0].text);
        });
        return listDirection;
    }

    afficheGrille() {
        var grilleTab = matrix( this.config.maxY, this.config.maxX, " ")

        // Recherche des cases murs "M"
        this.artefacts.forEach(element => {
            if(element.type === 'M') {
                grilleTab[element.coordonnee.x][element.coordonnee.y] = "M";
            }
        });

        // Cases occupées par les lumicycles
        this.lumicycles.forEach(lumicycle => {  
            lumicycle.points.forEach((point, index) => {  
                let aff = lumicycle.joueur;
                if(lumicycle.joueur == 1 && index == lumicycle.points.length-1)
                    aff = "O";
                else if(lumicycle.joueur == 2 && index == lumicycle.points.length-1)
                    aff = "X";

                grilleTab[point.y][point.x] = aff;
            });
        });

        let grille = "";

        grilleTab.reverse().forEach(ligne => {
            grille += "|";
            ligne.forEach(col => {
                grille += col+ "|"
            });
            grille += "\n";
        });

        console.log(grille);
    }
}

function fibonacci(num) {
    if (num <= 1) return 1;  
    return fibonacci(num - 1) + fibonacci(num - 2);
}

function matrix( rows, cols, defaultValue){

    var arr = [];
  
    // Creates all lines:
    for(var i=0; i < rows; i++){
  
        // Creates an empty line
        arr.push([]);
  
        // Adds cols to the empty line:
        arr[i].push( new Array(cols));
  
        for(var j=0; j < cols; j++){
          // Initializes:
          arr[i][j] = defaultValue;
        }
    }
  
  return arr;
  }

const artefacts = json.artefacts.map(art => new Artefact(art.type, new Coordonnee(art.x, art.y)));
  const lumicycles = json.lumicycles.map(lum => {
      const points = lum.points.map(p => new Coordonnee(p.x, p.y));
      return new Lumicycle(lum.joueur, points, []);
  });
  const config = new Configuration(json.config.id,json.config.tour,json.config.maxX,
      json.config.maxY, json.config.nbJoueurs, json.config.nbVehicules);

  const game = new Game(artefacts, lumicycles, config);
  console.log("Tour: "+game.config.tour);
  //console.log(game.getJoueur1().getTete());
  //console.log("Joueur1: ",game.getJoueur1().points);
  //console.log("Joueur2: ",game.getJoueur2().points);
  game.calculCasesInterdites();
  let direction = game.determineDirection();

  console.log(direction);
  game.afficheGrille();