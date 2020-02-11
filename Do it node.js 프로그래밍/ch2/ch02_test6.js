let cal = require('./calc2');// 객체 자체를 받음
console.log('모듈로 분리한 후 : cal2.add : '+cal.add(10,10));

let nconf=require('nconf');
nconf.env();
let value = nconf.get('OS');
console.log("os 환경변수의 값 : "+value);