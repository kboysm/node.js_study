let http = require('http');
let app = http.createServer();

app.listen(1234,()=>{ // app.listen(port,callback) || app.listen(port,host,동시에접속할수있는클라이언트수(int),callback)
    console.log('http 서버 port:1234 연결');
});

app.on('connection',(socket)=>{ //connection 이벤트가 발생하면 실행
    console.log('클라이언트 접속');
});
app.on('request',(req,res)=>{ //request 이벤트가 발생하면 실행
    console.log('클라이언트 요청이 들어옴'); 
    //console.dir(req);
    res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});//응답 헤더 만들기
    res.write('<h1>hihi</h1>'); //응답데이터 만들기
    res.end(); //만들어진 데이터를 보냄
});