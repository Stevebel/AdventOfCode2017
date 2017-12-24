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

    let particle = {p,v,a, num: particles.length, dead: false};
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
    for(let i = 0; i < 1000; i++){
        for(let j = 0; j < particles.length; j++){
            let p = particles[j];
            if(p.dead) continue;
            for(let k = j + 1; k < particles.length; k++){
                let p2 = particles[k];
                if(p2.dead) continue;
                if(p.p.x === p2.p.x && p.p.y === p2.p.y && p.p.z === p2.p.z){
                    p.dead = true;
                    p2.dead = true;
                }
            }
            add(p.v,p.a);
            add(p.p, p.v);
        }
        particles = particles.filter(p => !p.dead);
        
    }
    console.log(particles.length);
});