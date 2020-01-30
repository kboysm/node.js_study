const http = require('http');

const hostname = '127.0.0.1';
const port = 1337;

http.createServer((req,res) =>{
    res.writeHead(200,{'Content-Type':'text/plain'});
    res.end('Hello World\n');
}).listen(port,hostname,()=>{
    console.log(`server running at http://${hostname}:${port}/`);
});
//이 위의 코드는 웹서버를 만드는 코드
//실행방법은 해당 경로에서 cmd로 드가서 node werserver.js 를 치면 실행 됨