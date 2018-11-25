const Coordonnee = require('./Coordonnee');
const Arc = require('./Arc');
const Utils = require('./Utils');
const Algorithm = require('./Algorithm');

const Direction = Utils.Direction;
const idDirection = Utils.IdDirection;

class Game {
    constructor(artefacts, lumicycles, config) {
        this.artefacts = artefacts;
        this.lumicycles = lumicycles;
        this.config = config;
        this.casesInterdites = [];
        this.calculCasesInterdites();
        this.arcs = [];
        //this.calculArcs();
        this.algo = new Algorithm(this);
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
            if(element.type === 'M' || element.type === 'A' || element.type === 'R') {
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
     * Calcul les arcs du jeu
     */
    calculArcs() {
        this.calculArcGrille();
        this.calculArcHorsLimiteGauche();
        this.calculArcHorsLimiteHaut();
        this.calculArcHorsLimiteDroite();
        this.calculArcHorsLimiteBas();   
    }

    /**
     * Calcul les arcs dans la grille
     */
    calculArcGrille() {
        for(var x=0; x < this.config.maxX; x++) {
            for(var y=0; y < this.config.maxY; y++) {
                const caseCourante = new Coordonnee(x,y);
                if(this.estCaseInterdite(caseCourante))
                {
                    // case du dessus
                    this.determineArc(caseCourante, new Coordonnee(x, y+1));
                    
                    // case diagonale en haut à droite
                    this.determineArc(caseCourante, new Coordonnee(x+1, y+1));

                    // case à droite
                    this.determineArc(caseCourante, new Coordonnee(x+1, y));

                    // case diagonale bas gauche
                    this.determineArc(caseCourante, new Coordonnee(x+1, y-1));
                }
            } 
        }
    }

    /**
     * Calcul les arcs dans la partie hors limite gauche
     */
    calculArcHorsLimiteGauche() {
         // Coté gauche
         for(var y=0; y < this.config.maxY; y++) {
            const caseCourante = new Coordonnee(-1,y);

            // Case du dessus
            if( y !== this.config.maxY -1)
                this.arcs.push(new Arc(caseCourante,new Coordonnee(-1, y+1)));

            // case diagonale en haut à droite
            this.determineArc(caseCourante, new Coordonnee(0, y+1));

            // case à droite
            this.determineArc(caseCourante, new Coordonnee(0, y));

            // case diagonale bas droite
            this.determineArc(caseCourante, new Coordonnee(0, y-1));
        }
    }

    /**
     * Calcul les arcs dans la partie hors limite haut
     */
    calculArcHorsLimiteHaut() {
        // En Haut
        for(var x=0; x < this.config.maxX; x++) {
            const y = this.config.maxY;
            const caseCourante = new Coordonnee(x,y);           

            // Case à droite
            if( x !== this.config.maxX -1)
                this.arcs.push(new Arc(caseCourante,new Coordonnee(x+1, y)));

            // case diagonale en bas à gauche
            this.determineArc(caseCourante, new Coordonnee(x-1, y-1));

            // case en dessous
            this.determineArc(caseCourante, new Coordonnee(x, y-1));

            // case diagonale bas droite
            this.determineArc(caseCourante, new Coordonnee(x+1, y-1));
        }
    }

    /**
     * Calcul les arcs dans la partie hors limite droite
     */
    calculArcHorsLimiteDroite() {
        // Coté droite
        for(var y=0; y < this.config.maxY; y++) {
            const x = this.config.maxX;
            const caseCourante = new Coordonnee(x,y);

            // Case du dessus
            if( y !== this.config.maxY -1)
                this.arcs.push(new Arc(caseCourante,new Coordonnee(x, y+1)));

            // case diagonale en haut à gauche
            this.determineArc(caseCourante, new Coordonnee(x-1, y+1));

            // case à gauche
            this.determineArc(caseCourante, new Coordonnee(x-1, y));

            // case diagonale bas gauche
            this.determineArc(caseCourante, new Coordonnee(x-1, y-1));
        }
    }

    /**
     * Calcul les arcs dans la partie hors limite bas
     */
    calculArcHorsLimiteBas() {
        // En Bas
        for(var x=0; x < this.config.maxX; x++) {
            const caseCourante = new Coordonnee(x,-1);           

            // Case à droite
            if( x !== this.config.maxX -1)
                this.arcs.push(new Arc(caseCourante,new Coordonnee(x+1, -1)));

            // case diagonale en haut à gauche
            this.determineArc(caseCourante, new Coordonnee(x-1, 0));

            // case au dessus
            this.determineArc(caseCourante, new Coordonnee(x, 0));

            // case diagonale haut droite
            this.determineArc(caseCourante, new Coordonnee(x+1, 0));
        }
    }

    /**
     * Determine si une coordonnee est interdite
     * Si vrai, on ajoute l'arc entre les 2 coordonnees
     * @param {Coordonnee} coordBase 
     * @param {Coordonnee} coordTest 
     */
    determineArc(coordBase, coordTest)
    {
        if(this.estCaseInterdite(coordTest))
        {
            this.arcs.push(new Arc(coordBase,coordTest));
        }
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
                dangerosite += Utils.fibonacci((coeff + this.getCoeffIsTeteAdverse(c)) - Math.abs(coeff_revise));
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
                dangerosite += Utils.fibonacci((coeff + this.getCoeffIsTeteAdverse(c)) - Math.abs(coeff_revise));
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
        if(this.estCaseDangereuse(coord)){
            return 9999;
        }            
        else
        {
            return 0;
            //return this.algo.coeffDirectionsAEviter(coord) ;
        }
    }

    /**
     * Determine la position à jouer
     */
    determineDirection() {
        let listDirection = [];
        this.getJoueur1().forEach(J1 => {
            const coordJ1 = J1.getTete();

            // Liste des directions possibles
            let directionsPossibles = this.getDirectionsPossibles(coordJ1);
            if(process.env.DEBUG)
                console.log("directions possible", directionsPossibles);
            
            // Liste de toutes les directions triées par dangerosié
            let directionsParDangerosite = this.getDangerositeParDirection(coordJ1);

            // Directions possibles triées par dangerosité
            let directions = directionsParDangerosite.filter(element => {
                if(directionsPossibles.indexOf(element.dir) != -1)
                    return element;
            });
            if(process.env.DEBUG)
                console.log("directions possibles par dangerosite",directions);
            
            // Tri de la liste en fonction du nombre de coups avant la mort
            directions = this.getDirectionsTrieesParNbCoupsAvantMort(directions);
            if(process.env.DEBUG)
                console.log("directions possibles par dangerosite et par coup avant la mort",directions);
            listDirection.push(directions.length > 0 ? directions[0].text : "UP");
        });
        return listDirection;
    }

    /**
     * Retourne la liste de toutes les directions triée par dangerosité
     * @param {Coordonnee} coordJ1 : coordonnee de la tete traitée
     */
    getDangerositeParDirection(coordJ1)
    {
        let dangerositeU = 0;
        let dangerositeD = 0;
        let dangerositeL = 0;
        let dangerositeR = 0;

        let coeff = Utils.NIVEAU_MAX + 3;

        for(let n = 1; n <= Utils.NIVEAU_MAX; n++)
        {
            dangerositeU += this.checkLigne(coordJ1, n, Direction.UP, coeff);
            dangerositeD += this.checkLigne(coordJ1, n, Direction.DOWN, coeff);
            dangerositeL += this.checkColonne(coordJ1, n, Direction.LEFT, coeff);
            dangerositeR += this.checkColonne(coordJ1, n, Direction.RIGHT, coeff);

            coeff--;
        }

        const coordUP = new Coordonnee(coordJ1.x, coordJ1.y + 1);
        const coordDOWN = new Coordonnee(coordJ1.x, coordJ1.y - 1);
        const coordLEFT = new Coordonnee(coordJ1.x - 1, coordJ1.y);
        const coordRIGHT = new Coordonnee(coordJ1.x + 1, coordJ1.y);

        // tri des directions en fonction de la dangerosité
        const listeDirDang = [
            {dir: idDirection.UP, dang: dangerositeU, coord: coordUP, text: "UP"},
            {dir: idDirection.DOWN, dang: dangerositeD, coord: coordDOWN, text: "DOWN"},
            {dir: idDirection.LEFT, dang: dangerositeL, coord: coordLEFT, text: "LEFT"},
            {dir: idDirection.RIGHT, dang: dangerositeR, coord: coordRIGHT, text: "RIGHT"}
        ];

        return listeDirDang.sort((objA, objB) => objA.dang - objB.dang);
    }

    /**
     * 
     * @param {Coordonnee} coordJ1 : coordonnee de la tete traitée
     */
    getDirectionsPossibles(coordJ1) {
        const directions = [];
        if(!this.estCaseDangereuse(new Coordonnee(coordJ1.x, coordJ1.y + 1)))
        {
            directions.push(idDirection.UP);
        }
        if(!this.estCaseDangereuse(new Coordonnee(coordJ1.x, coordJ1.y - 1)))
        {
            directions.push(idDirection.DOWN);
        }
        if(!this.estCaseDangereuse(new Coordonnee(coordJ1.x - 1, coordJ1.y)))
        {
            directions.push(idDirection.LEFT);
        }
        if(!this.estCaseDangereuse(new Coordonnee(coordJ1.x + 1, coordJ1.y)))
        {
            directions.push(idDirection.RIGHT);
        }

        return directions;
    }

    /**
     * Tri les directions possibles en fonction du nombre de cases avant la mort puis par dangerosité en cas d'égalité
     * @param {Array} directionsPossibles : liste des directions possibles triée par dangerosité
     */
    getDirectionsTrieesParNbCoupsAvantMort(directionsPossibles)
    {

        let listeDirectionSansCulSac = directionsPossibles.map(element => {
            return Object.assign(element, {nbCoupAvtMort: this.algo.nb_coup_dispo(element.coord)});
        });
        if(process.env.DEBUG)
            console.log("listeDirectionSansCulSac", listeDirectionSansCulSac);
        
        listeDirectionSansCulSac =  listeDirectionSansCulSac.sort((objA, objB) => {
            let a = objB.nbCoupAvtMort - objA.nbCoupAvtMort;

            if(a === 0)
            {
                a = objA.dang - objB.dang;
            }

            return a;
        });
        if(process.env.DEBUG)
            console.log("listeDirectionSansCulSac trié", listeDirectionSansCulSac);
        return listeDirectionSansCulSac;
    }

    afficheGrille() {
        var grilleTab = Utils.matrix( this.config.maxY, this.config.maxX, " ")

        // Recherche des cases murs "M"
        this.artefacts.forEach(element => {
            if(element.type === 'M') {
                grilleTab[element.coordonnee.y][element.coordonnee.x] = "M";
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

module.exports = Game;