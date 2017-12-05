var readline = require('readline');
var reader = readline.createInterface({
  input: process.stdin,
  output: new require('stream').Writable(),
  terminal: false
});

var total = 0;
reader.on('line', function(line){
    let nums = line.split(/\s/).map((num) => num * 1);
    total += Math.max.apply(this,nums) - Math.min.apply(this, nums);
});

reader.on('close', function(){
  console.log(total);
});