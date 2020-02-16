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
connectDB=function(){
    let databaseurl = 'mongodb://localhost:27017/local'
    MongoClient.connect(databaseurl,(err,db)=>{
        if(err){
            console.log('db연결 실패');
            return;
        }
        console.log('db연결 성공'+databaseurl);
        database=db.db('local'); //이녀석 db 라고만 배워서 에러가 발생함 , 한참을 해매다 db.db('local')을 해주어 해결
        //이유는 몽고db 3.0이상을 사용할 때는 database명을 명시해야 함
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
    saveUninitialized:true,
}));

let router = express.Router();
router.route('/process/login').post((req,res)=>{
    console.log('/process/login 라우팅 함수 호출')
    let paramId = req.body.id || req.query.id;
    let paramPassword = req.body.password || req.query.password;
    console.log('요청 파라미터 : '+paramId + ', '+ paramPassword);
    if(database){
        authUser(database,paramId,paramPassword,(err,docs)=>{
            if(err){
                console.log('에러발생');
                res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>err발생</h1>');
                res.end();
                return;
            }
            if(docs){
                console.dir(docs);
                res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>login  성공</h1>');
                res.write('<div><p>사용자 : '+docs[0].name+'</p></div>');
                res.write('<br><br><a href="/public/login.html">다시 로그인하기</a>');
                res.end();
                
            }else{
                console.log('에러발생');
                res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 데이터가 조회 안됨</h1>');
                res.end();
                
            }
        });
    }else{
        console.log('에러발생');
                res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>mongodb 연결 실패</h1>');
                res.end();
    }
});
app.use('/',router);

let authUser = function(db,id,password,callback){
    console.log('authUser 호출 : '+id+","+password);
    let users=db.collection('users'); 
    //db안에 있는 users라는 컬렉션을 참조하겠다는 의미
    users.find({"id":id,"password":password}).toArray((err,docs)=>{
        if(err){
            callback(err,null);
            return;
        }
        if(docs.length>0){
            console.log('사용자를 찾음');
            callback(null,docs);
        }else{
            console.log('일치하는 사용자를 찾지 못함.');
            callback(null,null);
        }
    });
};

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
    connectDB();
});