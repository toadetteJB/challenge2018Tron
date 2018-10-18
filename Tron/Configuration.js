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

module.exports = Configuration;