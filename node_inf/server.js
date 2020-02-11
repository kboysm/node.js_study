let http = require('http');
let fs = require('fs');
//web page가 없을 때 404 에러
send404res=(res)=>{
    res.writeHead(404,{"Content-Type":"text/plain"});
    res.write("404 Error: oops!!");
    res.end();
}
//사용자 요구에 응답 처리하기

onReqest=(req,res)=>{
    if(req.method === 'GET' && req.url ==='/'){
        res.writeHead(404,{"Content-Type":"text/html"});
        fs.createReadStream("./index.html").pipe(res);
    }else{
        //index.html외 프로젝트 폴더에 없는 파일을 찾는경우
    send404res(res);
    }
};
http.createServer(onReqest).listen(1234,()=>{
    console.log("port1234");
})