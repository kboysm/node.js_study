let express= require('express');
let http = require('http');
let static = require('serve-static');
let path = require('path');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let expressSession = require('express-session');
let user =require('./routes/user');
let config = require('./config');
let database_loader = require('./database/database_loader');
let route_loader = require('./routes/route_loader');
//암호화 모듈
let crypto = require('crypto');
//에러 핸들러
let expressErrorHandler= require('express-error-handler');

let app = express();

app.set('views',__dirname+'/views');
app.set('view engine','ejs');

console.log('config.server_port : '+config.server_port);
app.set('port',config.server_port || 1234);
app.use('/public',static(path.join(__dirname,'public')));

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true,
}));

route_loader.init(app,express.Router());

let errorHandler = expressErrorHandler({
    static:{
        '404':'./public/404.html'
    }
})
app.use( expressErrorHandler.httpError(404));
app.use( errorHandler);

let server = http.createServer(app).listen(app.get('port'),()=>{
    console.log(app.get('port')+"번 포트로 접속 완료!");
    //db연결
    database_loader.init(app,config);
});