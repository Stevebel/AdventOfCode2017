var readline = require('readline');
var reader = readline.createInterface({
  input: process.stdin,
  output: new require('stream').Writable(),
  terminal: false
});

let validCount = 0;

reader.on('line', function(line){
    
    if(!hasDupe(line)){
      validCount++;
    }
});
function hasDupe(line){
  let found = {};
  return line.split(/\s/).some(function(word){
      if(!found[word]){
          found[word] = true;
          return false;
      }
      return true;
    });
}

reader.on('close', function(){
  console.log("Valid: ", validCount);
});