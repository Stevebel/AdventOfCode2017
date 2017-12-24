let mask = ((2<<15) - 1),
a = 512,
b = 191,
fA = 16807,
fB = 48271,
mA = 4,
mB = 8,
count = 0,
judgeA = null,
judgeB = null
;
for(let i = 0; i < 5000000;){
if(judgeA == null){
    a = ( a * fA ) % 2147483647;
    if(a % mA == 0){ judgeA = a; }
}
if(judgeB == null){
    b = ( b * fB ) % 2147483647;
    if(b % mB == 0){ judgeB = b; }
}

if(judgeA != null && judgeB != null){
    i++;
    if((judgeA & mask) == (judgeB & mask)){
        count++;
    }
    judgeA = null;
    judgeB = null;
}
if(i % 10000 == 0) console.log(i);
}
console.log(count)