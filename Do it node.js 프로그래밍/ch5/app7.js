let express = require('express');
let http = require('http');
let static = require('serve-static');
let path = require('path');
let bodyParser = require('body-parser');
let app = express();
let router= express.Router();

app.set('port',process.env.PORT || 1234);
app.use('/public',static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
router.route('/process/login').post((req,res)=>{
//미들웨어처럼 모든것을 받는것이 아니라 /process/login path로 들어오는 요청만 받는 router
  let paramId=  req.body.id || req.query.id;
  let password=  req.body.password || req.query.password;

  res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
  res.write("<h1>server login response</h1>");
  res.end(paramId +"    :    "+password);
});
app.use('/',router);

let server = http.createServer(app).listen(app.get('port'),()=>{
    console.log(app.get('port')+"번 포트로 연결");
})