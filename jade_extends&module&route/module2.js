let sum = require('./lib/sum');
console.log(sum(1,2));

let cal = require('./lib/calculator');
console.log("cal sum : ",cal.sum(1,2));
console.log("cal avg : ",cal.avg(1,2));

//복잡해진 코드에서 서로 연관되어 있는 코드들을 별도로 분리해서 복잡성을 낮추기 위해 사용