class Lumicycle {
    constructor(joueur, points, artefacts) {
        this._joueur = joueur;
        this._points = points;
        this._artefacts = artefacts;
    }

    set joueur (joueur)    { this._joueur = joueur}
    get joueur ()      { return this._joueur}
    set points (points) { this._points = points}
    get points ()     { return this._points}
    set artefacts (artefacts){ this._artefacts = artefacts}
    get artefacts ()    { return this._artefacts}
}
