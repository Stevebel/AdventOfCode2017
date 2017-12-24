var readline = require('readline');
var reader = readline.createInterface({
  input: process.stdin,
  output: new require('stream').Writable(),
  terminal: false
});

const re = /p=<(.+?),(.+?),(.+?)>, v=<(.+?),(.+?),(.+?)>, a=<(.+?),(.+?),(.+?)>/;
let particles = [];
reader.on('line', function(line){
    let [_,pX,pY,pZ,vX,vY,vZ,aX,aY,aZ] = re.exec(line);
    let p = {x: pX*1, y: pY*1, z: pZ*1};
    let v = {x: vX*1, y: vY*1, z: vZ*1};
    let a = {x: aX*1, y: aY*1, z: aZ*1};
    
    for(let i = 0; i < 10000; i++){
        add(v,a);
        add(p, v);
    }

    let particle = {p,v,a,closest: Math.abs(p.x) + Math.abs(p.y) + Math.abs(p.z), num: particles.length};
    particles.push(particle);
});
function add(v1,v2){
    v1.x += v2.x;
    v1.y += v2.y;
    v1.z += v2.z;
}
function sameDir(v1, v2){
    return sameSign(v1.x, v2.x) && sameSign(v1.y, v2.y) && sameSign(v1.z, v2.z);
}
function sameSign(a,b){
    return (a * b) >= 0;
}

reader.on('close', function(){
  particles.sort((a,b) => a.closest - b.closest);
  console.log(particles.filter(p => !sameDir(p.v,p.a)));
  console.log(particles[0]);
});