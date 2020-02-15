let express = require('express');
let http = require('http');
let static = require('serve-static');
let path = require('path');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let app = express();
let router= express.Router();
app.set('port',process.env.PORT || 1234);
app.use('/public',static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(bodyParser.json());
app.all("*",(req,res)=>{
    res.status(404).send("<h1>페이지를 찾을 수 없습니다.</h1>")
});
router.route('/process/setUserCookie').get((req,res)=>{
    res.cookie('user',{
        id : 'LSM',
        name : '륌쉉묜',
        authorized:true
    });
    res.redirect('/process/showCookie');
});
router.route('/process/showCookie').get((req,res)=>{
    let cookies = req.cookies;

    res.send(cookies);
});

router.route('/process/login/:name').post((req,res)=>{
//미들웨어처럼 모든것을 받는것이 아니라 /process/login path로 들어오는 요청만 받는 router
  let paramId=  req.body.id || req.query.id;
  let password=  req.body.password || req.query.password;
  let name = req.params.name; //qureyString의 name
  res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
  res.write("<h1>server login response</h1>");
  res.end(paramId +"    :    "+password+"   :   "+name);
});
app.use('/',router);

let server = http.createServer(app).listen(app.get('port'),()=>{
    console.log(app.get('port')+"번 포트로 연결");
})