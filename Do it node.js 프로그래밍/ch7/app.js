let express= require('express');
let http = require('http');
let static = require('serve-static');
let path = require('path');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let expressSession = require('express-session');
let user =require('./routes/user');
//암호화 모듈
let crypto = require('crypto');
//에러 핸들러
let expressErrorHandler= require('express-error-handler');
//몽고디비(mongoose)
let mongoose=require('mongoose');
let database;
let UserSchema;
let UserModel;

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

connectDB=function(){ //몽구스를 사용할 때는 이벤트를 많이 사용함
    let databaseurl = 'mongodb://localhost:27017/local'
    mongoose.Promise = global.Promise; //이건 문법같은것으로 외워야함
    mongoose.connect(databaseurl);
    database=mongoose.connection;
    database.on('open',()=>{
        console.log('데이터베이스 연결(몽구스) '+databaseurl);
        createUserSchema(database);
    });
    database.on('disconnected',()=>{
        console.log('DB연결 끊어짐.');
    });
    database.on('error',console.error.bind(console,'mongoose 연결 애러.'));
    app.set('database',database);
};

function createUserSchema(database){
    database.UserSchema = require('./database/user_schema').createSchema(mongoose);
    database.UserModel= mongoose.model('users3',database.UserSchema); // 기존 users와 스키마 구조가 다르기때문에 users2로 콜렉션의 이름을 변경
        console.log('UserModel 정의함');
}

router.route('/process/listuser').post((req,res)=>{user.listuser});
router.route('/process/adduser').post((req,res)=>{user.adduser});
router.route('/process/login').post((req,res)=>{user.login});
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
    //db연결
    connectDB();
});