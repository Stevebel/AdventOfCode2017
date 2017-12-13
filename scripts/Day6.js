if (process.argv.length < 3) {
console.log('Usage: node ' + process.argv[1] + ' FILENAME');
process.exit(1);
}
var fs = require('fs')
, filename = process.argv[2];
fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;

    console.log(countCycles(data.split(/\s/).map(i => i*1)));
});

function countCycles(blocks){
    let visited = {};
    let cycles = 0;
    while(true){
        let hash = getHash(blocks);
        console.log(hash);
        if(visited[hash]){ break;}
        else { visited[hash] = true; }

        let maxIndex = blocks.indexOf(Math.max(...blocks));
        let count = blocks[maxIndex];
        blocks[maxIndex] = 0;
        for(i=1;i<=count;i++){
            blocks[(maxIndex + i) % blocks.length]++;
        }
        cycles++;
    }
    return cycles;
}

function getHash(blocks){
    return blocks.join(',');
}