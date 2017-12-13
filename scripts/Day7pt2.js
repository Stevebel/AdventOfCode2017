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
        weight: parts[2] * 1,
        list: parts[4]
    }
    nodeList.push(node);
});

reader.on('close', function(){
  // Create tree
  nodeList.forEach((node) => {
      if(node.list){
          let hashes = node.list.split(', ');
          node.children = hashes.map(function(hash){
              return nodeList.find((child) => child.hash === hash);
          });
          node.children.forEach((child) => child.parent = node);
      }
  });
  let head = nodeList.find((node) => !node.parent);
  calcOverallWeight(head);
  // Find deepest node with imbalance
  let imbalanced = findImbalancedNode(head);
  // Determine which weight is out of place
  let weights = imbalanced.children.map(child => child.overallWeight).reduce((map, weight) => {
      map[weight] = (map[weight] || 0 ) + 1; return map;
    }, {});
  let oddWeight = 0, commonWeight = 0;
  for(weight in weights){
      if(weights[weight] > 1){
          commonWeight = weight;
      }else{
          oddWeight = weight;
      }
  }
  // Determine adjusted weight for odd node to correct imbalance
  let diff = commonWeight - oddWeight;
  let oddNode = imbalanced.children.find(child => child.overallWeight == oddWeight);

  console.log(oddNode.weight + diff);
});

function calcOverallWeight(node){
    return node.overallWeight = node.weight + 
        (node.children ? node.children.map(calcOverallWeight).reduce((sum, i) => sum + i, 0) : 0);
}
function findImbalancedNode(node){
    if(!node.children) return null;

    let imbalanced = node.children.find((child) => child.overallWeight != node.children[0].overallWeight) ? node : null

    if(imbalanced){
        let imbalancedChild = node.children.find(findImbalancedNode);
        if(imbalancedChild){
            return findImbalancedNode(imbalancedChild);
        }
        return node;
    }
    return null;
}