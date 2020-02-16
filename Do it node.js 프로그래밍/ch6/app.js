let express= require('express');
let http = require('http');
let static = require('serve-static');
let path = require('path');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let expressSession = require('express-session');
//에러 핸들러
let expressErrorHandler= require('express-error-handler');
//몽고디비
let MongoClient=require('mongodb').MongoClient;
let database;
connectDB=()=>{
    let databaseurl = 'mongodb://localhost:27017/local'
    MongoClient.connect(databaseurl,(err,db)=>{
        if(err){
            console.log('db연결 실패');
            return;
        }
        console.log('db연결 성공'+databaseurl);
        database=db;
    })

};
let app = express();
app.set('port',process.env.PORT || 1234);
app.use('/public',static(path.join(__dirname,'public')));

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));

let router = express.Router();

app.use('/',router);

let errorHandler = expressErrorHandler({
    static:{
        '404':'./public/404.html'
    }
})
app.use( expressErrorHandler.httpError(404));
app.use( errorHandler);

let server = http.createServer(app).listen(app.get('port'),()=>{
    console.log(app.get('port')+"번 포트로 접속 완료!");
});