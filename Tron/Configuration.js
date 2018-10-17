class Configuration {

    constructor (id, tour, maxX, maxY, nbJoueurs, nbVehicules) {
        this._id = id
        this._tour = tour;
        this._maxX = maxX;
        this._maxY = maxY;
        this._nbJoueurs = nbJoueurs;
        this._nbVehicules = nbVehicules;
    }

    set id (id)    { this._id = id}
    get id ()      { return this._id}
    set tour (tour) { this._tour = tour}
    get tour ()     { return this._tour}
    set maxX (maxX){ this._maxX = maxX}
    get maxX ()    { return this._maxY}
    set maxY (maxY) { this._maxY = maxY}
    get maxY ()     { return this._maxY}
    set maxX (nbJoueurs){ this._nbJoueurs = nbJoueurs}
    get maxX ()    { return this._nbJoueurs}
    set maxY (nbVehicules) { this._nbVehicules = nbVehicules}
    get maxY ()     { return this._nbVehicules}
}