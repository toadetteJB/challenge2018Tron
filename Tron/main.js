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
        return this.lumicycles[0];
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
            if(this.estCaseDangereuse({x,y}))
                dangerosite += fibonacci(coeff - Math.abs(coeff_revise));
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
            if(this.estCaseDangereuse({x,y}))
                dangerosite += fibonacci(coeff - Math.abs(coeff_revise));
            coeff++;
        }
        return dangerosite;
    }

    /**
     * Détermine une valeur de dangerosite d'une case adjacente
     * @param {Coordonnee} coord 
     */
    dangerositeImmediate(coord)
    {        
        if(this.estCaseInterdite(coord))
            return 9999;
        else
            return 0;
    }

    /**
     * Determine la position à jouer
     */
    determineDirection() {
        const coordJ1 = this.getJoueur1().getTete();
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

        return listeDirDang[0].text;
    }
}

function fibonacci(num) {
    if (num <= 1) return 1;  
    return fibonacci(num - 1) + fibonacci(num - 2);
}

let json = {
    "artefacts": [
      {
        "type": "M",
        "x": 10,
        "y": 11
      },
      {
        "type": "A",
        "x": 1,
        "y": 1
      },
      {
        "type": "M",
        "x": 19,
        "y": 8
      },
      {
        "type": "M",
        "x": 18,
        "y": 3
      },
      {
        "type": "M",
        "x": 19,
        "y": 4
      }
    ],
    "lumicycles": [
      {
        "joueur": 1,
        "points": [
          {
            "x": 19,
            "y": 2
          },
          {
            "x": 19,
            "y": 3
          }
        ],
        "artefacts": [
          "P"
        ]
      },
      {
        "joueur": 2,
        "points": [
          {
            "x": 10,
            "y": 17
          }
        ],
        "artefacts": []
      }
    ],
    "config": {
      "id": 1,
      "tour": 2,
      "maxX": 30,
      "maxY": 20,
      "nbJoueurs": 2,
      "nbVehicules": 1
    }
  }

// Boucle sur les données reçues à chaque tour
// while (true) {
//     let json = readline();

    
// }



  //console.log(JSON.stringify(json));
//   var http = require('http');
// http.createServer(function (req, res) {
//     res.writeHead(200, {'Content-Type': 'application/json'});
//     res.end(JSON.stringify('UP'));
// }).listen(8000, '127.0.0.1');

// var http = require('http');
// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.write('UP');
//   res.end();
// }).listen(8000);

var http = require('http');
/*var server = http.createServer( function(req, res) {

    console.dir(req.param);

    if (req.method == 'POST') {
        console.log("POST");
        var body = '';
        req.on('data', function (data) {
            body += data;
            console.log("Partial body: " + body);
        });
        req.on('end', function () {
            console.log("Body: " + body);
        });
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('post received');
    }
    else
    {
        console.log("GET");
        var html = '<html><body><form method="post" action="http://localhost:3000">Name: <input type="text" name="name" /><input type="submit" value="Submit" /></form></body>';
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(html);
    }

});

let port = 8000;
let host = '127.0.0.1';
server.listen(port, host);
console.log('Listening at http://' + host + ':' + port);
*/
http.createServer((request, response) => {
    let direction = Direction.UP;
    let body = '';
    if (request.method == 'POST') {
        request.on('error', (err) => {
            console.error("Erreur:");
            console.error(err);
        }).on('data', (chunk) => {
            console.log('ordre recu');
            body += chunk;
            let json = JSON.parse(body);
            const artefacts = json.artefacts.map(art => new Artefact(art.type, new Coordonnee(art.x, art.y)));
            const lumicycles = json.lumicycles.map(lum => {
                const points = lum.points.map(p => new Coordonnee(p.x, p.y));
                return new Lumicycle(lum.joueur, points, []);
            });
            const config = new Configuration(json.config.id,json.config.tour,json.config.maxX,
                json.config.maxY, json.config.nbJoueurs, json.config.nbVehicules);

            const game = new Game(artefacts, lumicycles, config);
            game.calculCasesInterdites();
            direction = game.determineDirection();
        }).on('end', () => {
        // BEGINNING OF NEW STUFF
    
        response.on('error', (err) => {
            console.error(err);
        });
    
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.write(JSON.stringify(direction));
        response.end();
        // Note: the 2 lines above could be replaced with this next one:
        // response.end(JSON.stringify(responseBody))
    
        // END OF NEW STUFF
        });
    }
  }).listen(8000);