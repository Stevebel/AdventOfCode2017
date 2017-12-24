
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
    let instructions = lines.map((line) => line.split(/\s+/));
    let programs = [];
    for(let i = 0; i < 2; i++){
        programs.push(new createProgram(i, instructions, send(i)));
    }

    function send(p){
        return function(value){
            programs.forEach((program, i) => {
                if(i !== p){
                    program.queue.push(value);
                }
            });
        };
    }

    let i = 0;
    while(programs.some(program => !program.terminated) && !programs.every(program => program.waiting)){
        programs.forEach(program => program.step());
    }

    console.log(programs[1].sendCount);
}
function createProgram(p, instructions, sendFn){
    let self = this;
    let registers = {p};
    let ptr = 0;

    self.waiting = false;
    self.terminated = false;
    self.queue = [];
    self.sendCount = 0;
    self.step = function(){
        if(self.terminated || self.waiting && self.queue.length === 0) return;
        let curr = instructions[ptr];
        let startPtr = ptr;
        switch(curr[0]){
            case 'snd':
                sendFn(getValue(curr[1]));
                self.sendCount++;
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
                if(self.queue.length > 0){
                    registers[curr[1]] = self.queue.shift();
                    self.waiting = false;
                }else{
                    self.waiting = true;
                    ptr--;
                }
                break;
            case 'jgz':
                if(getValue(curr[1]) > 0){
                    ptr += getValue(curr[2]);
                    ptr--;
                }
                break;
        }
        ptr++;
        if(ptr < 0 || ptr >= instructions.length){
            self.terminated = true;
        }
    }

    function getValue(param){
        let value = parseInt(param);
        if(isNaN(param)){
            return registers[param] || 0;
        }
        return value;
    }

    return self;
}