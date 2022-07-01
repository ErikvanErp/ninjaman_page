
// based on world array
// generate div.row for each row of world array
// generate children of div.row for each column of world array:
//     div.blank, div.wall, div.sushi, or div.onigiri
function drawWorld(){
    var output = "";

    for(var row = 0; row < world.length; row++){
        output += "<div class = 'row'>"
        for(var col = 0; col < world[row].length; col++){
            output += `<div class = \'${worldDict[world[row][col]]}\'></div>`
        }
        output += "</div>"
    }

    document.getElementById('world').innerHTML = output;
}

// generate a random world
function generateWorld(numRows, numCols){
    var world = [];

    // first and last rows are borders
    // first and last columns are borders

    for(var i=0; i<numRows; i++){
        for(var j=0; j<numCols; j++){
            if(j==0){
                world.push([1]);
            }
            else if(j==numCols - 1){
                world[i].push(1);
            }
            else if(i==0 || i==numRows - 1){
                world[i].push(1);
            }
            else {
                world[i].push(0);
            }
        }
        
    }

    // randomly create internal walls
    var y = 0, x = 0;
    
    for(var i = 0; i < numCols * numRows; i++){
        x = Math.floor(Math.random() * numCols);
        y = Math.floor(Math.random() * numRows);
    
        if(tileAvailable(world, x, y)){
            world[y][x] = 1;
        }
    }
    
    // randomly add fixed number of sushi = 2 and onigiri = 3

    var size = world.length * world[0].length;

    var count2 = 0;
    while (count2 < size * 0.05){
        x = Math.floor(Math.random() * numCols);
        y = Math.floor(Math.random() * numRows);

        if (world[y][x] == 0){
            world[y][x] = 2;
            count2++;
        }
    }

    var count3 = 0;
    while (count3 < size * 0.1){
        x = Math.floor(Math.random() * numCols);
        y = Math.floor(Math.random() * numRows);

        if (world[y][x] == 0){
            world[y][x] = 3;
            count3++;
        }
    }

    return world;
}


// check whether world[y][x] can be changed to a wall tile
// problem: avoid creating blank regions in the ninjaworld
// that are separated by walls
// solution: 
// 1. inspect the 8 neighboring tiles of world[y][x]
// 2. changing world[y][x] to a wall tile should not result in 2 or more 
//    disconnected blank regions in the 3x3 square surrounding world[y][x]
function tileAvailable(world, x, y){
    
    var numRows = world.length;
    var numCols = world[0].length;

    if (x == 0 || x == numCols - 1 || y == 0 || y == numRows - 1){
        return false;
    }

    var neighbors = [];
    neighbors.push(world[y-1][x-1]);
    neighbors.push(world[y-1][x]);
    neighbors.push(world[y-1][x+1]);
    neighbors.push(world[y][x+1]);
    neighbors.push(world[y+1][x+1]);
    neighbors.push(world[y+1][x]);
    neighbors.push(world[y+1][x-1]);
    neighbors.push(world[y][x-1]);
    
    var countDiff = 0;
    for (var i = 0; i < 8; i++){
        if(i < 7 && neighbors[i] != neighbors[i+1]){
            countDiff++;
        } 
        else if (neighbors[7] != neighbors[0]){
            countDiff++;
        }    
    }

    if (countDiff > 2){
        return false;
    }
    else {
        return true;
    }
}