console.log('argv 속성의 파라미터 수 : %d',process.argv.length);
//argv는 무엇인가? 
console.dir(process.argv);//이것으로 확인하자,배열로 되어있다.
//process도 대표적인 전역변수로 어디서든 접근이 가능하다

process.argv.forEach((item,index)=>{
    console.log(index+" : "+ item);
});