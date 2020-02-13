let http = require('http');
let fs =require('fs');
let app = http.createServer();

app.listen(1234,()=>{ 
    console.log('http 서버 port:1234 연결');
});

app.on('connection',(socket)=>{ 
    console.log('클라이언트 접속');
});
app.on('request',(req,res)=>{ 
    console.log('클라이언트 요청이 들어옴'); 
    let filename = 'c1.jpg';
    fs.readFile(filename,(err,data)=>{
        res.writeHead(200,{"Content-Type":"image/jpg"});
        res.write(data); 
        res.end(); 
    });
});