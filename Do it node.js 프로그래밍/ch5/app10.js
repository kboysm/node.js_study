let express = require('express');
let http = require('http');
let static = require('serve-static');
let path = require('path');//path 모듈 
let bodyParser = require('body-parser');//post 방식의 데이터를 body로 받을 수 있게 해줌
let cookieParser = require('cookie-parser');//익스프레스에서 쿠키를 사용할 수 있게 해주는 모듈
let expressSession = require('express-session');//익스프레스에서 세션을 사용할 수 있게 해주는 모듈
let app = express();
let router= express.Router(); //익스프레스 내 라우터
let multer=require('multer'); //파일 업로드에 필요한 모듈
let fs = require('fs'); //파일 시스템 모듈
let cors = require('cors');//다중 접속 지원 모듈
app.set('port',process.env.PORT || 1234); //포트 번호 지정 
app.use('/public',static(path.join(__dirname,'public')));
app.use('/uploads',static(path.join(__dirname,'uploads')))
app.use(bodyParser.urlencoded({extended:false})); //body-parser를 사용하기 위해서 반드시 해주는 듯함
app.use(cookieParser());
app.use(bodyParser.json());
app.use(expressSession({
    //세션에 대한 설정정보
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));
app.use(cors());//다중 접속 허용
let storage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'uploads');
    },
    filename:(req,file,callback)=>{
        //callback(null,file.originalname+Date.now());
        let extension = path.extname(file.originalname);
        let basename = path.basename(file.originalname,extension);
        callback(null,basename+Date.now()+extension);
        //동일 이름으로 파일이 들어올 경우 덮어 씌워지기 때문에 중간에 Date함수를 호출하여 겹치지 않게함
    }
});
let upload = multer({
    storage:storage,
    limits:{
        files:10,//파일의 최대 개수
        fileSize:1024*1024*1024 //파일의 크기
    }
})
router.route('/process/photo').post(upload.array('photo',1),(req,res)=>{
    //upload변수의 array 메서드를 호출하여 upload된 파일을 배열화
    console.log('photo router 호풀');
    let files = req.files;
    if(files.length>0){
    console.dir(files[0]);}
    else{
        console.log('파일이 없습니다.');
    }
    let originalname;
    let filename;
    let mimetype;
    let size;
    if(Array.isArray(files)){
        for(let i=0;i<files.length;i++){
            originalname = files[i].originalname;
            filename = files[i].filename;
            mimetype = files[i].mimetype;
            size = files[i].size;
        }
    }
    res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
    res.write("<h1>파일 업로드 성공</h1>");
    res.write('<p>원본파일 : '+originalname+"</p>");
    res.write('<p>저장파일 : '+filename+'</p>');
    res.write('<p>'+mimetype+'</p><br><p>'+size+'</p>');
    res.end();
});

router.route('/process/product').get((req,res)=>{
    console.log('product router');

    if(req.session.user){
        res.redirect('/public/product.html')
    }else{
        res.redirect('/public/login.html');
    }
});

router.route('/process/login').post((req,res)=>{
    console.log('/process/login 라우팅 함수 호출됨');
    let paramId = req.body.id || req.query.id;
    let password = req.body.password || req.query.password;
    console.log(paramId +" : "+password);

    if(req.session.user){
        console.log('이미 로그인!');
        res.redirect('/public/product.html');
    }
    else{
        req.session.user ={
            id:paramId,
            name : "LSM",
            authorized : true
        };
        res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
        res.write('<h1>로그인 성공</h1>');
        res.write(paramId);
        res.write('<br><a href="/process/product">상품 페이지</a>')
        res.end();
    }

});
router.route('/process/logout').get((req,res)=>{
    if(req.session.user){
        console.log('logout');
        req.session.destroy((err)=>{ //세션파괴
            if(err){
                console.log(err)
                return;
            }
            res.redirect('/public/login.html');
        })
    }
    else{
        res.redirect('/public/login.html');
    }
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
  let name = req.params.name;
  res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
  res.write("<h1>server login response</h1>");
  res.end(paramId +"    :    "+password);
});
app.use('/',router);
app.all("*",(req,res)=>{
    res.status(404).send("<h1>페이지를 찾을 수 없습니다.</h1>")
});
let server = http.createServer(app).listen(app.get('port'),()=>{
    console.log(app.get('port')+"번 포트로 연결");
})