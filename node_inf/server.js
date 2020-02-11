// let http = require('http');
// let fs = require('fs');
// //web page가 없을 때 404 에러
// send404res=(res)=>{
//     res.writeHead(404,{"Content-Type":"text/plain"});
//     res.write("404 Error: oops!!");
//     res.end();
// }
// //사용자 요구에 응답 처리하기

// onReqest=(req,res)=>{
//     if(req.method === 'GET' && req.url ==='/'){
//         res.writeHead(404,{"Content-Type":"text/html"});
//         fs.createReadStream("./index.html").pipe(res);
//     }else{
//         //index.html외 프로젝트 폴더에 없는 파일을 찾는경우
//     send404res(res);
//     }
// };
// http.createServer(onReqest).listen(1234,()=>{
//     console.log("port1234");
// })

let connect = require('connect');
let http = require('http');

let app = connect(); //connect모듈을 통해 웹서버에서 필요한
//기능을 깔끔하게 처리함

// doOne=(req,res,next)=>{
//     console.log("do one");
//     next(); //next 함수가 없으면 doTwo가 안나옴
//     //next 함수를 써줘야 doTwo가 나옴
// }
// doTwo=(req,res)=>{
//     console.log("do two");
// };
// app.use(doOne);
// app.use(doTwo);
about=(req,res)=>{
    console.log("사용자가 about page를 요청함");
}
email =(req,res)=>{
    console.log("사용자가 email page를 요청함");
}
app.use('/about',about);
app.use('/email',email);
http.createServer(app).listen(1234,()=>{
    console.log("Start Server");
});