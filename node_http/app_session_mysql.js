let express = require('express');
let bodyParser = require('body-parser');
let session = require('express-session'); //기본적으로 세션은 메모리에 저장해둠. app을 껏다키면 날라감
let MySQLStore = require('express-mysql-session')(session);
let app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
    secret: '123JOPJ@#$%1269',
    resave: false,
    saveUninitialized: true,
    store:new MySQLStore({
        //option
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '1234',
            database: 'o2'
    }) //file과 달리 DB사용시 반드시 option을 넣어줘야함 ,이 옵션을 주고 app을 실행하면 자동으로 DB에 세션이라는 테이블이 생성됌
  }));
app.get('/count',(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else {
        req.session.count=1;
    }
    res.send('count : '+req.session.count);
});
app.get('/auth/logout',(req,res)=>{
    delete req.session.displayName; //세션을 제거 , 자바스크립트 명령임
    req.session.save(()=>{
        res.redirect('/welcome'); //DB에 저장이 끝났을 때 실행하라! 이거 아주중요 내가 프로젝트 할 때 경험했던 문제임 , 콜백의 중요성
    });
});
app.post('/auth/login',(req,res)=>{
    let user = {
        username:'Lsm',
        password:'1234',
        displayName:'nickNameLSM'
    }; //DB대신 직접박음 , 소스코드에 비번이 있는경우 굉장히 안좋은 방식
    let uname=req.body.username;
    let pwd =req.body.password;
    if(uname === user.username && pwd ===user.password){
        req.session.displayName = user.displayName;
        res.redirect('/welcome');
    }else{
        res.send('who are you?<a href="/auth/login>Login</a>');
    }
});
app.get('/welcome',(req,res)=>{
    if(req.session.displayName){
        res.send(`
        <h1>hello,${req.session.displayName} </h1>
        <a href="/auth/logout">logout</a>
        `);
    }else{
        res.send(`
        <h1>Welcome</h1>
        <a href="/auth/login">Login</a>
        `);

    }
});
app.get('/auth/login',(req,res)=>{
    let output=`
    <h1>Login</h1>
    <form action="/auth/login" method="post">
        <p>
            <input type="text" name="username" placeholder="username">
        </p>
        <p>
            <input type="password" name="password" placeholder="password">
        </p>
        <p>
            <input type="submit" value="제출">
        </p>
    </form>
    `;
    res.send(output);
});

app.listen(3003,()=>{
    console.log('Connected 3003 port!!!');
});
