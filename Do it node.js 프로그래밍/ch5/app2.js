//미들웨어는 중간에 요청을 처리하고 라우터는 요청 패스에 따라 분기하여 처리

let express = require('express');
let http = require('http');
let app = express();
app.set('port',process.env.PORT || 1234);

app.use((req,res,next)=>{
    console.log('이게 미들웨어다!');

    res.writeHead(200,{'Content-Type':'text/html; charset=utf8'});
    res.end('<h1>서버 응답 결과</h1>');
})

let server= http.createServer(app).listen(app.get('port'),()=>{
    console.log('express web server'+app.get('port'));
});