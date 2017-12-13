var readline = require('readline');
var reader = readline.createInterface({
  input: process.stdin,
  output: new require('stream').Writable(),
  terminal: false
});

let nodes = [];
reader.on('line', function(line){
    let [id, connections] = line.split('<->').map(i => i.trim());
    nodes.push({
        id: id,
        connections: connections.split(', ')
    });
});

reader.on('close', function(){
    nodes.forEach((node) => {
        node.connections = node.connections.map(function(id){
            return nodes.find((child) => child.id === id);
        });
    });

    let zero = nodes.find(node => node.id == 0);
    populateConnectedTo(zero, '0');
    console.log("Connected to 0", nodes.filter(node => node.connected).length);

    let groupCount = 1;
    nodes.forEach((node) => {
        if(!node.connected){
            groupCount++;
            populateConnectedTo(node);
        }
    });
    console.log("Group count", groupCount);
});

function populateConnectedTo(node){
    if(!node.connected){
        node.connected = true;

        node.connections.forEach(other => populateConnectedTo(other));
    }
}