
// Make sure we got a filename on the command line.
if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME');
    process.exit(1);
}
// Read the file and print its contents.
var fs = require('fs')
, filename = process.argv[2];

fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;

    findRecovered(data.trim().split(/\r?\n/));
});

function findRecovered(lines){
    let registers = {};
    let sound = 0;
    let recovered = null;
    let ptr = 0;

    let instructions = lines.map((line) => line.split(/\s+/));
    
    while(recovered === null && ptr >= 0 && ptr < instructions.length){
        let curr = instructions[ptr];
        let startPtr = ptr;
        switch(curr[0]){
            case 'snd':
                sound = getValue(curr[1]);
                break;
            case 'set':
                registers[curr[1]] = getValue(curr[2]);
                break;
            case 'add':
                registers[curr[1]] = getValue(curr[1]) + getValue(curr[2]);
                break;
            case 'mul':
                registers[curr[1]] = getValue(curr[1]) * getValue(curr[2]);
                break;
            case 'mod':
                registers[curr[1]] = getValue(curr[1]) % getValue(curr[2]);
                break;
            case 'rcv':
                if(getValue(curr[1]) !== 0){
                    recovered = sound;
                }
                break;
            case 'jgz':
                if(getValue(curr[1]) !== 0){
                    ptr += getValue(curr[2]);
                    ptr--;
                }
                break;
        }
        ptr++;
        console.log(startPtr, curr, registers, ptr);
        
    }

    function getValue(param){
        let value = parseInt(param);
        if(isNaN(param)){
            return registers[param] || 0;
        }
        return value;
    }
    console.log(recovered);
}