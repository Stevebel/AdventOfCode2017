var readline = require('readline');
var reader = readline.createInterface({
  input: process.stdin,
  output: new require('stream').Writable(),
  terminal: false
});

var total = 0;
reader.on('line', function(line){
    let nums = line.split(/\s/).map((num) => num * 1);
    nums.forEach((num1, i) => {
      nums.slice(i + 1).forEach((num2) => {
        var result = num1 > num2 ? num1/num2 : num2/num1;
        if(result === Math.floor(result)){
          total += result;
        }
      })
    });
});

reader.on('close', function(){
  console.log(total);
});