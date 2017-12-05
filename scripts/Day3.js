const SIZE = 11;
let 
    x = (SIZE - 1)/2,
    y = (SIZE - 1)/2,
    dir = {x:0, y:-1},
    grid = [],
    ring = 3,
    rots = 0,
    steps = 0,
    target = process.argv[2]
;

function getGrid(x,y){
    return grid[y * SIZE + x] || 0;
}
function setGrid(x,y,i){
    return grid[y * SIZE + x] = i;
}
function rot90(){
    dir = {x: dir.y, y: -dir.x};
    rots++;
}
function sumNeighbors(tX,tY){
    return  getGrid(tX - 1, tY - 1) + getGrid(tX, tY - 1) + getGrid(tX + 1, tY - 1)
        +   getGrid(tX - 1, tY + 0) + getGrid(tX, tY + 0) + getGrid(tX + 1, tY + 0)
        +   getGrid(tX - 1, tY + 1) + getGrid(tX, tY + 1) + getGrid(tX + 1, tY + 1);
}

let i = 1;
setGrid(x,y,1);
x++;
y++;

while(x < SIZE && y < SIZE){
    if(steps >= ring - 1){
        rot90();
        steps = 0;
    }
    if(rots >= 4){
        rots = 0;
        x++;
        y++;
        ring += 2;
    }
    x += dir.x;
    y += dir.y;
    steps++;

    let sum = sumNeighbors(x,y);
    setGrid(x,y,sum);
    if(target && sum > target){
        console.log("Next: " + sum);
        target = null;
    }
}

//Print
for(let i = 0; i < SIZE; i++){
    let out = "";
    for(let j = i * SIZE; j < (i + 1) * SIZE; j++){
        out += ((grid[j] || 0) + '').padStart(9, '0') + '|';
    }
    console.log(out);
}