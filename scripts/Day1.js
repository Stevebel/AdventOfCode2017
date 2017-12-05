
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
  
  console.log(sum(data));
});

function sum(data){
  let values = data.split('').map((num) => num * 1);
  return values.filter(function(value, i){
    return value === values[(i + 1) % values.length];
  }).reduce((sum, val) => sum + val, 0);
}