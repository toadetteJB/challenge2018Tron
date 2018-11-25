const  Direction = {
    UP: 1,
    DOWN: -1,
    LEFT: -1,
    RIGHT: 1
  };

const  IdDirection = {
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
  };

const NIVEAU_MAX = 5;

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

  module.exports = {Direction, IdDirection, NIVEAU_MAX, fibonacci, matrix };