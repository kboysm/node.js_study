const http = require('http');

const hostname = '127.0.0.1';
const port = 1337;

http.createServer((req,res) =>{ //서버를 만드는 문법
    res.writeHead(200,{'Content-Type':'text/plain'});
    res.end('Hello World\n'); //해당 서버에 접속했을때 웹브라우저에 보이는 요소
}).listen(port,hostname,()=>{ //그 서버가 컴퓨터에 리스닝하게 시킨다.
    console.log(`server running at http://${hostname}:${port}/`);
});
//이 위의 코드는 웹서버를 만드는 코드
//실행방법은 해당 경로에서 cmd로 드가서 node werserver.js 를 치면 실행 됨
