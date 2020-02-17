let express= require('express');
let http = require('http');
let static = require('serve-static');
let path = require('path');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let expressSession = require('express-session');
//에러 핸들러
let expressErrorHandler= require('express-error-handler');
//몽고디비(mongoose)
let mongoose=require('mongoose');
let database;
let UserSchema;
let UserModel;
connectDB=function(){ //몽구스를 사용할 때는 이벤트를 많이 사용함
    let databaseurl = 'mongodb://localhost:27017/local'
    mongoose.Promise = global.Promise; //이건 문법같은것으로 외워야함
    mongoose.connect(databaseurl);
    database=mongoose.connection;
    database.on('open',()=>{
        console.log('데이터베이스 연결(몽구스) '+databaseurl);
        UserSchema=mongoose.Schema({
            id : String,
            name : String,
            password : String
        }); 
        console.log('UserSchema 정의.');
        UserModel= mongoose.model('users',UserSchema); // users콜렉션과 우리가 만든 UserSchema를 연결시켜줌
        console.log('UserModel 정의함');
    });
    database.on('disconnected',()=>{
        console.log('DB연결 끊어짐.');
    });
    database.on('error',console.error.bind(console,'mongoose 연결 애러.'));
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
router.route('/process/adduser').post((req,res)=>{
    console.log('/process/adduser 라우팅 함수 호출');
    let paramId = req.body.id || req.query.id;
    let paramPassword = req.body.password || req.query.password;
    let paramName = req.body.name || req.query.name;
    console.log("요청 파라미터 "+paramId+" , "+paramPassword+" , "+paramName);
    if(database){
        addUser(database,paramId,paramPassword,paramName,(err,result)=>{
            if(err){
                console.log('에러발생');
                res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>err발생</h1>');
                res.end();
                return;
            }
            if(result){
                console.dir(result);
                res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 추가 성공</h1>');
                res.write('<div><p>사용자 : '+paramName+'</p></div>');
                res.end();
            }else{
                console.log('에러발생');
                res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 추가 안됨</h1>');
                res.end();
            }
        })
    }else{
        console.log('에러발생');
                res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>데이터베이스 연결 안됨</h1>');
                res.end();
    }
})
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
    UserModel.find({"id":id,"password":password},(err,docs)=>{
        if(err){
            callback(err,null);
            return;
        }
        if(docs.length >0){
            console.log('사용자 추가'+docs.insertedCount);
            callback(null,docs);
        }else{
            console.log('추가된 레코드가 없음');
            callback(null,null);
        }
    });
};
let addUser = (db,id,password,name,callback)=>{
    console.log('add User 호출'+id+" , "+password+" , "+name);
    let user= new UserModel({"id":id,"password":password,"name":name});
    user.save((err)=>{
        if(err){
            callback(err,null);
            return;
        }
        console.log('사용자 데이터 추가함');
        callback(null,user);
    });
}
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