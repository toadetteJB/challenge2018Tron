class Game {
    constructor(artefacts, lumicycles, config) {
        this._artefacts = artefacts;
        this._lumicycles = lumicycles;
        this._config = config;
        this._listeMursProches = [];
    }

    set artefacts (artefacts) { this._artefacts = artefacts}
    get artefacts () { return this._artefacts}
    set lumicycles (lumicycles) { this._lumicycles = lumicycles}
    get lumicycles () { return this._lumicycles}
    set config (config){ this._config = config}
    get config (){ return this._config}
    set listeMursProches (listeMursProches){ this._listeMursProches = listeMursProches}
    get listeMursProches (){ return this._listeMursProches}

    ajouterMurProche (cases) {
        this._listeMursProches.push(cases);
    }

}