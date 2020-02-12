let Calc = require('./calc3');

let calc0 = new Calc();
calc0.emit('stop');

console.log('Calc에 event 전달');