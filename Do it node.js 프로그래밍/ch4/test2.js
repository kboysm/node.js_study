//서버쪽에서 ui없이도 이벤트가 발생함 ex) a모듈에서 b모듈로 데이터를 전달
//같은 프로그램 안에서 데이터를 전달할 때 사용
// emit()으로 데이터를 보내고 on()으로 데이터를 받는다

//exit이벤트가 발생시 자동호출
// process.on('exit',()=>{
//     console.log('exit event 발생!');
// });
// setTimeout(()=>{
//     console.log('2초후 실행');
//     process.exit();
// },2000);
console.log('2초후 실행될 것임');

process.on('lsm',(a)=>{
    console.log('new Event'+a);
});

setTimeout(()=>{
    console.log('2000');
    process.emit('lsm','2');
},2000);