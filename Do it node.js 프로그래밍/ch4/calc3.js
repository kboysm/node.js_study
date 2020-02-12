let EventEmitter=require('events').EventEmitter; //이벤트 모듈에서 EventEmitter라는 객체를 EventEmitter변수에 넣음
let util = require('util'); //상속을 하게 해주는 모듈이라고 함

let Calc = function(){
    this.on('stop',()=>{
        console.log('Calc에 stop 이벤트 전달됨');
    });
};
util.inherits(Calc,EventEmitter); //상속을 하는데 (자식,부모) 순으로 넣어줌
Calc.prototype.add = (a,b)=>{
    return a+b;
};
module.exports =Calc;