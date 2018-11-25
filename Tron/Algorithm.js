const Game = require('./Game');
const Coordonnee = require('./Coordonnee');
const Utils = require('./Utils');
const SEUIL = 35;

class Algorithm {

    /**
     * 
     * @param {Game} game 
     */
    constructor(game) {
        this.game = game;
        this.grille = [];
        this.initialiseGrille();
    }

    initialiseGrille()
    {
       this.grille = Utils.matrix( this.game.config.maxY, this.game.config.maxX, -1);

        // Recherche des cases murs "M"
        this.game.artefacts.forEach(element => {
            if(element.type !== 'P') {
                this.grille[element.coordonnee.y][element.coordonnee.x] = -99;
            }
        });

        // Cases occupées par les lumicycles
        this.game.lumicycles.forEach(lumicycle => {  
            lumicycle.points.forEach((point) => {  
                this.grille[point.y][point.x] = -99;
            });
        });
    }

    /**
     * 
     * @param {Coordonnee} coord 
     */
    coeffDirectionsAEviter(coordJ1)
    {        
        if(this.nb_coup_dispo(coordJ1) != SEUIL)
            return 9999;
        else 
            return 0;      
    }


    /**
     * 
     * @param {Coordonnee} coordNewDir 
     */
    nb_coup_dispo(coordNewDir) {
    
        let Q = [];

        // initially all vertices are unexplored
        let layer = this.grille.map(a => ({...a})); 

        layer[coordNewDir.y][coordNewDir.x] = 0
        Q.push(coordNewDir);

        // as long as Q is not empty
        let prof = 1;
        let profmin = 1;
        while (Q.length > 0) {
            // get the next vertex u of Q that must be looked at
            let u = Q.shift(0);
            const voisins = this.getVoisinDispo(u, layer);

            voisins.forEach(z => {
                // if z is being found for the first time
                
                if (layer[z.y][z.x] == -1)
                {
                    layer[z.y][z.x] = layer[u.y][u.x] + 1;
                    Q.push(z);
                }

                profmin = prof;
            });
            if(prof == SEUIL)
            {
                profmin = SEUIL;
                break;
            }
            prof++;
        }
        return profmin;
    }

    /**
     * 
     * @param {Coordonnee} coord 
     * @param {Array} grille 
     */
    getVoisinDispo(coord, grille) {
        let voisin = [];
        // test case haut
        if(!this.game.estCaseDangereuse(new Coordonnee(coord.x, coord.y+1)))
            voisin.push(new Coordonnee(coord.x, coord.y+1));
        // test case bas
        if(!this.game.estCaseDangereuse(new Coordonnee(coord.x, coord.y-1)))
            voisin.push(new Coordonnee(coord.x, coord.y-1));
        // test case gauche
        if(!this.game.estCaseDangereuse(new Coordonnee(coord.x-1, coord.y)))
            voisin.push(new Coordonnee(coord.x-1, coord.y));
        // test case droite
        if(!this.game.estCaseDangereuse(new Coordonnee(coord.x+1, coord.y)))
            voisin.push(new Coordonnee(coord.x+1, coord.y));

        return voisin;
    }
}


module.exports = Algorithm;