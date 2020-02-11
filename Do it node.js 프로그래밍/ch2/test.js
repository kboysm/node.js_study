console.log("hihi");

console.log("저는 %d살 입니다.",28);

console.log("저는 %s에 삽니다.",'성수동');

let person = {
    name : "LSM",
    address : "서울시 성동구 성수동"
}

console.log("자바스크립트 객체 입니다. %j",person);
console.dir(person);
//console.dir은 객체를 인자로 넣어준다. 자바스크립트 객체를 그대로 출력해준다.
console.time('key'); //key값을 넣어줌
let result=0;
for(let i=0 ; i<10000;i++){
    result+=i;
}
console.timeEnd('key');//key값을 이용해서 걸린 시간을 체크해줌
//console.time은 시간이 얼마나 걸렸는지 확인하기 위해서 사용한다.

//자주 사용하는 변수나 함수
console.log('파일이름 : %s',__filename); //파일의 확장자까지 다나옴
console.log('path : %s',__dirname); //파일의 경로까지 나옴
//__filename , __dirname은 전역변수이다.