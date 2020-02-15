
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
// app.use('/public',static(path.join(__dirname,'public')));
// app.use('/uploads',static(path.join(__dirname,'uploads')))
 app.use(express.static('projects'));
app.use(bodyParser.urlencoded({extended:false})); //body-parser를 사용하기 위해서 반드시 해주는 듯함
app.use(cookieParser());
app.use(bodyParser.json());
app.set('views', __dirname);
//app.set('views', __dirname + '/img');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(expressSession({
    //세션에 대한 설정정보
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));
app.use(cors());//다중 접속 허용
let storage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'img');
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

router.route('/login').get((req,res)=>{
    output=`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Login</h1>
    <br>
    <form action="/login" method="post">
        <input type="text" name="id" placeholder="id"><br>
        <input type="password" name="password" placeholder="password"><br>
        <input type="submit" value="제출">
    </form>
</body>
</html>
    `;
    res.send(output);
});
router.route('/').get((req,res)=>{
 
    if(req.session.user){
        res.redirect('/loginSucess');
    }else{
        res.redirect('/login');
    }
});
router.route('/loginSucess').get((req,res)=>{
    //res.render('index.html');

    fs.readdir('./img',(err,files)=>{
        let output=`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>


    `;
        files.forEach(file => {
            output += `<img src="./img/${file}" alt="imageTest" width="150" height="150">`;
        })
output+=`
<br>
    <form method="post" action="/photo" enctype="multipart/form-data">
        <table>
            <tr>
                <td><label>파일</label></td>
                <td><input type="file" name="photo"></td>
            </tr>
        </table>
        <input type="submit" value="업로드">
    </form>
    <br><br>
    <a href="/logout">로그아웃</a>
`;        
        res.send(output);
    })
    

})
router.route('/login').post((req,res)=>{
    req.session.user ={
        id:req.body.id,
        name : "LSM",
        authorized : true
    };
    res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
        res.write('<h1>로그인 성공</h1>');
        res.write(req.body.id);
        res.write('<br><a href="/">메인</a>')
        res.end();

});
router.route('/logout').get((req,res)=>{
    if(req.session.user){
        console.log('logout');
        req.session.destroy((err)=>{ //세션파괴
            if(err){
                console.log(err)
                return;
            }
            res.redirect('/login');
        })
    }
    else{
        res.redirect('/login');
    }
});
router.route('/img/:img').get((req,res)=>{
    fs.readFile('./img/'+req.params.img,(err,data)=>{
        console.dir(data);
        res.writeHead(200,{"Content-Type":"image/jpeg"});
        res.end(data);
    })
})
router.route('/photo').post(upload.array('photo',1),(req,res)=>{
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
    res.end("<br><a href='/'>home</a>");
});

app.use('/',router);
app.all("*",(req,res)=>{
    res.status(404).send("<h1>페이지를 찾을 수 없습니다.</h1>")
});
let server = http.createServer(app).listen(app.get('port'),()=>{
    console.log(app.get('port')+"번 포트로 연결");
})