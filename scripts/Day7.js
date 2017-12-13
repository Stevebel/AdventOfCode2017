var readline = require('readline');
var reader = readline.createInterface({
  input: process.stdin,
  output: new require('stream').Writable(),
  terminal: false
});

const re = /(\w+) \((\d+)\)( -> (.+))?/;
let nodeList = [];
reader.on('line', function(line){
    let parts = re.exec(line);
    if(parts == null){
        console.error("Couldn't parse", line);
        return;
    }
    let node = {
        hash: parts[1],
        weight: parts[2],
        list: parts[4]
    }
    nodeList.push(node);
});

reader.on('close', function(){
  nodeList.forEach((node) => {
      if(node.list){
          let hashes = node.list.split(', ');
          node.children = hashes.map(function(hash){
              return nodeList.find((child) => child.hash === hash);
          });
          node.children.forEach((child) => child.parent = node);
      }
  });
  console.log(nodeList.filter((node) => !node.parent));
});