let fs =require('fs');
 //파일의 전체 내용을 읽어옴, 동기방식(파일을 다 읽을 때까지 대기하고 그다음 작업을 실행함 )
//let data =fs.readFileSync('../package.json','utf-8');

//비동기 방식(파일을 다 읽을 때까지 대기하지 않고 그 다음 작업을 수행함->콜백함수의 필요성)
// fs.readFile('../package.json','utf-8',(err,data)=>{
//     console.log(data);
// });
// let text1 = '노드제이에스+자바스크립트 너무 재밌자나!!!!';
// fs.writeFile('./lsm.txt',text1,(err)=>{
//     if(err){
//         console.log(err);
//         return;
//     }
//     console.log('파일 쓰기 완료!');
// });
// fs.writeFileSync('./lsm.txt',text1);

//비동기 파일 오픈
fs.open('./lsm.txt','w',(err,fd)=>{ //fd : 파일 디스크럽터
    if(err){
        console.log(err);
        console.dir(err);
        return;
    }
    let buf = new Buffer('03:05시'); //보통 버퍼라는 객체를 만들고 거기에 내용을 넣어서 write한다고 함
    fs.write(fd,buf,0,buf.length,null,(err,written,buffer)=>{ //파일 쓰기
        if(err){
            console.log(err);
            console.dir(err);
            return;
        }
        console.log('파일 쓰기 완료');
        fs.close(fd,()=>{
            console.log('파일 닫기 완료함');
        }); //파일을 닫는 명령
    });
});//정상적으로 오픈하면 콜백함수 실행