let fs = require('fs');
//Sync
console.log(1);
let data = fs.readFileSync('data.txt',{encoding:'utf-8'});
console.log(data);
//동기적인 방식으로 data파일을 읽어 data변수에 담음

//Async
console.log(2);
fs.readFile('data.txt',{encoding:'utf-8'},(err,data) => {
    console.log(3);
    console.log(data);
});
console.log(4);
//콜백함수가 있기 때문에 따로 변수에 데이터를 저장하지 않고 작업이 끝나면 익명의 함수를 호출해서 data라는 결과를 출력하게했다!! 