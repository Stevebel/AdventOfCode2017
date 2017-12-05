var readline = require('readline');
var reader = readline.createInterface({
  input: process.stdin,
  output: new require('stream').Writable(),
  terminal: false
});

reader.on('line', function(line){
    console.log(line);
});

reader.on('close', function(){
  console.log("END");
});