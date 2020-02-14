//미들웨어는 중간에 요청을 처리하고 라우터는 요청 패스에 따라 분기하여 처리
let express = require('express');
let http = require('http');
let static=require('serve-static');
let path = require('path');
let bodyParser = require('body-parser');
let app = express();
app.use(static(path.join(__dirname,'public')));//요청을 다 허용하는 static
app.use(bodyParser.urlencoded({extended:false}));
app.set('port',process.env.PORT || 1234);
app.use(bodyParser.json());
app.use((req,res,next)=>{
    console.log('이게 미들웨어다!');

    //res.redirect('https://www.google.com/webhp?hl=ko&ictx=2&sa=X&ved=0ahUKEwi2re-84s_nAhWPHHAKHUFuCEcQPQgH');//구글로 리다이렉트 시킴
    let user=req.header('User-Agent');
    let name = req.body.name || req.query.name; //get , post 둘 다 받을 수 있다.
    res.send('<p>'+user+'</p><br>'+name);
})

let server= http.createServer(app).listen(app.get('port'),()=>{
    console.log('express web server'+app.get('port'));
});