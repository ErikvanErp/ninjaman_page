var gameover = false;

// ninjaman = pacman is initially placed on the first available blank space in world

var ninjaman = {
    x: 1,
    y: 1
}

while(world[ninjaman.y][ninjaman.x] != 0){
    if(ninjaman.x < world[ninjaman.y].length - 2){
        ninjaman.x++;
    }
    else {
        ninjaman.y++;
        ninjaman.x = 1;
    }
}

function drawNinjaman(){
    document.getElementById('ninjaman').style.top = ninjaman.y * 40 + 'px';
    document.getElementById('ninjaman').style.left = ninjaman.x * 40 + 'px';
}

drawNinjaman();

// arrow keys move the ninjaman around

var score = 0;

document.onkeydown = function(e){
    if (gameover){
        return;
    }

    if(e.keyCode == 37){// LEFT
        if(world[ninjaman.y][ninjaman.x - 1] != 1){
            ninjaman.x--;
        }
    }
    else if(e.keyCode == 38){// UP
        if(world[ninjaman.y - 1][ninjaman.x] != 1){
            ninjaman.y--;
        }
    }
    else if(e.keyCode == 39){// RIGHT
        if(world[ninjaman.y][ninjaman.x + 1] != 1){
            ninjaman.x++;
        }
    }
    else if(e.keyCode == 40){// DOWN
        if(world[ninjaman.y + 1][ninjaman.x] != 1){
            ninjaman.y++;
        }
    }

    // keep score if ninjaman eats sushi or onigiri
    if (world[ninjaman.y][ninjaman.x] == 2){
        score += 10;
    }
    else if (world[ninjaman.y][ninjaman.x] == 3){
        score += 5;
    }
    document.getElementById('score').textContent = "Score: "+score;

    // where ninjaman moves, tile is made blank
    world[ninjaman.y][ninjaman.x] = 0; 
    
    // re-draw world and ninjaman 
    // based on new content of world array and ninjaman coordinates
    drawWorld();
    drawNinjaman();
}

// redghost is initially placed at the bottom right corner

var redghost = {
    x: 1,
    y: 1,
    xPrev: 1,
    yPerv: 1 
}

redghost.y = world.length - 2;
redghost.x = world[0].length - 2;

while(world[redghost.y][redghost.x] != 0){
    if(redghost.x > 2){
        redghost.x--;
    }
    else {
        redghost.y--;
        redghost.x = world[0].length - 2;
    }
}

function drawRedghost(){
    document.getElementById('redghost').style.top = redghost.y * 40 + 'px';
    document.getElementById('redghost').style.left = redghost.x * 40 + 'px';
}

drawRedghost();

// blueghost is initially placed at the bottom left corner

var blueghost = {
    x: 1,
    y: 1,
    xPrev: 1,
    yPerv: 1 
}

blueghost.y = world.length - 2;
blueghost.x = 1;

while(world[blueghost.y][blueghost.x] != 0){
    if(blueghost.y > 2){
        blueghost.y--;
    }
    else {
        blueghost.x++;
        blueghost.y = world.length - 2;
    }
}

function drawBlueghost(){
    document.getElementById('blueghost').style.top = blueghost.y * 40 + 'px';
    document.getElementById('blueghost').style.left = blueghost.x * 40 + 'px';
}

drawBlueghost();

// pumpky is initially placed at the top right corner

var pumpkyghost = {
    x: 1,
    y: 1,
    xPrev: 1,
    yPerv: 1 
}

pumpkyghost.x = world[0].length - 2;
pumpkyghost.y = 1;

while(world[pumpkyghost.y][pumpkyghost.x] != 0){
    if(pumpkyghost.y < world.lenght - 2){
        pumpkyghost.y++;
    }
    else {
        pumpkyghost.x--;
        pumpkyghost.y = 1;
    }
}

function drawPumpkyghost(){
    document.getElementById('pumpkyghost').style.top = pumpkyghost.y * 40 + 'px';
    document.getElementById('pumpkyghost').style.left = pumpkyghost.x * 40 + 'px';
}

drawPumpkyghost();

// move a ghost to the tile that brings it closest (by straight line) 
// to ninjaman
// a ghost never moves back to where it was before its previous move

function newtileForGhost(ghost){
    // the 4 options for ghost's move
    var options = [
        {x:0, y:0},
        {x:0, y:0},
        {x:0, y:0},
        {x:0, y:0}
    ]

    options[0].x = ghost.x; 
    options[0].y = ghost.y + 1; // 0 = Up
    options[1].x = ghost.x + 1; // 1 = right
    options[1].y = ghost.y; 
    options[2].x = ghost.x; 
    options[2].y = ghost.y - 1; // 2 = down
    options[3].x = ghost.x - 1; // 3 = left
    options[3].y = ghost.y; 

    // sort the 4 options in order of preference
    // based on distance to ninjaman
    var updown = ninjaman.y - ghost.y;
    var leftright = ninjaman.x - ghost.x;

    var optionsOrder = [0,1,2,3];
    if (updown**2 > leftright**2 && updown > 0){
        if (leftright > 0){
            optionsOrder = [0,1,3,2];
        }
        else {
            optionsOrder = [0,3,1,2];
        }
    }
    else if (updown**2 > leftright**2){
        if (leftright > 0){
            optionsOrder = [2,1,3,0];
        }
        else {
            optionsOrder = [2,3,1,0];
        }
    }
    else if (leftright > 0){
        if (updown > 0){
            optionsOrder = [1,0,2,3];
        }
        else {
            optionsOrder = [1,2,0,3];
        }
    }
    else {
        if (updown > 0){
            optionsOrder = [3,0,2,1];
        }
        else {
            optionsOrder = [3,2,0,1];
        }
    }

    // pick the option with the highest preference
    // which is not a wall 
    // and never move back to the previous ghost position

    var option = {};
    option.xPrev = ghost.x;
    option.yPrev = ghost.y;
    
    for (i=0; i<4; i++){
        option.x = options[optionsOrder[i]].x;
        option.y = options[optionsOrder[i]].y;

        if (world[option.y][option.x] != 1
            && (option.x != ghost.xPrev || option.y != ghost.yPrev)){
            return option ;
        }
    }

    // if cannot make any move, move back to where ghost came from

    option.x = ghost.xPrev;
    option.y = ghost.yPrev;
    return option;
}

// move redghost

function moveRedGhost(){
    if(gameover) {
        window.clearInterval(redghostTimer);
        return;
    }
    redghost = newtileForGhost(redghost);
    drawRedghost();
    if (redghost.x == ninjaman.x && redghost.y == ninjaman.y){
        gameover = true;
    }
}

redghostTimer = window.setInterval(moveRedGhost, 300);

// move blueghost

function moveBlueGhost(){
    if(gameover) {
        window.clearInterval(blueghostTimer);
        return;
    }
    blueghost = newtileForGhost(blueghost);
    drawBlueghost();
    if (blueghost.x == ninjaman.x && blueghost.y == ninjaman.y){
        gameover = true;
    }
}

blueghostTimer = window.setInterval(moveBlueGhost, 750);

// move pumpky

function movePumpkyGhost(){
    if(gameover) {
        window.clearInterval(pumpkyghostTimer);
        return;
    }
    pumpkyghost = newtileForGhost(pumpkyghost);
    drawPumpkyghost();
    if (pumpkyghost.x == ninjaman.x && pumpkyghost.y == ninjaman.y){
        gameover = true;
    }
}

pumpkyghostTimer = window.setInterval(movePumpkyGhost, 500);



