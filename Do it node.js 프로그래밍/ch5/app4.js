let express= require('express');
let http = require('http');

let app = express();
app.set('port',process.env.PORT || 1234);

app.use((req,res,next)=>{
    console.log('미들웨어 발동 첫번째!');
    req.user = 'LSM';
    next(); // 다음 미들웨어로 순서를 넘김
    
});
app.use((req,res,next)=>{
    console.log('미들웨어 발동! 두번째!');
    let person = {
        name : req.user,
        age:25
    }
    //res.send(`<h1>${req.user}야 아무거나 만들어보자~</h1>`);
    //res.send(JSON.stringify(person));//명시적으로 json으로 
    res.writeHead(200,{"Content-Type":"application/json;charset=utf8"});
    res.write(JSON.stringify(person));
    res.end();
});

let server =http.createServer(app).listen(app.get('port'),()=>{
    console.log('연결됐지롱~');
});