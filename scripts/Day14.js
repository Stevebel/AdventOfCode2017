const SIZE = 256;
const GRID_SIZE = 128;
// Make sure we got input on the command line.
if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' INPUT');
    process.exit(1);
  }

let input = process.argv[2];

let grid = makeGrid(input);
console.log(grid.map(s => s.filter(b => b == '1').length).reduce((sum, i) => sum + i,0));
console.log(countRegions(grid));

function countRegions(grid){
    let regions = 0;
    for(let x = 0; x < GRID_SIZE; x++){
        for(let y = 0; y < GRID_SIZE; y++){
            if(grid[x][y] == '1'){
                regions++;
                floodEmpty(grid, x, y);
            }
        }
    }
    return regions;
}

function floodEmpty(grid, x, y){
    if(x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE &&  grid[x][y] == '1'){
        grid[x][y] = '0';

        floodEmpty(grid, x - 1, y);
        floodEmpty(grid, x + 1, y);
        floodEmpty(grid, x, y - 1);
        floodEmpty(grid, x, y + 1);
    }
}

function makeGrid(input){
    let grid = [];
    for(let i = 0; i < 128; i++){
        let key = input + '-' + i;
        grid.push(toBinary(knotHash(key)));
    }
    return grid;
}

function toBinary(hash){
    return hash.split('')
        .map(c => parseInt(c,16))
        .map(i => i.toString(2)
        .padStart(4, '0'))
        .join('').split('');
}
function knotHash(input){
    let lengths = convertToLengths(input);
    let sparse = knotHashRounds(lengths, 64);
    let dense = [];
    const SPLIT = Math.sqrt(SIZE);
    for(let i = 0; i < SPLIT; i++){
        dense.push(
            sparse.slice(i * SPLIT, (i + 1) * SPLIT)
            .reduce((ans, item) => ans ^ item, 0)
        );
    }
    return dense.map(n => n.toString(16)).map(h => h.padStart(2, '0')).join('');
}
function convertToLengths(input){
    return input.split('').map(s => s.charCodeAt(0)).concat([17,31,73,47,23]);
}
function knotHashRounds(lengths, rounds){
    let pos = 0;
    let skip = 0;
    let seq = [...Array(SIZE).keys()];

    for(let round = 0; round < rounds; round++){
        lengths.forEach(length => {
            for(let i = 0; i < length/2; i++){
                let now = (pos + i) % SIZE;
                let later = (pos + length - 1 - i) % SIZE;
                [seq[now], seq[later]] = [seq[later], seq[now]];
            }
            pos += length + skip;
            skip++;
        });
    }
    return seq;
}