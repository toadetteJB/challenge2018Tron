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

module.exports = Lumicycle;
