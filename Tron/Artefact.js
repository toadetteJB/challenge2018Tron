export class Artefact {
    constructor(type, x, y){
        this._type = type;
        this._x = x;
        this._y = y;
    }

    set type (type) { this._type = type}
    get type () { return this._type}
    set x (x) { this._x = x}
    get x () { return this._x}
    set y (y){ this._y = y}
    get y (){ return this._y}
}