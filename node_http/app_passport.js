let express = require('express');
let bodyParser = require('body-parser');
let session = require('express-session'); //기본적으로 세션은 메모리에 저장해둠. app을 껏다키면 날라감
let FileStore = require('session-file-store')(session);
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
    secret: '123JOPJ@#$%1269',
    resave: false,
    saveUninitialized: true,
    store:new FileStore() //sessions라는 데이터 디렉토리가 자동으로 생성
    //세션이 파일로 저장됨 , 새로고침해도  web 브라우저의 id가 남음 ,쿠키를 삭제하면 다시 생성됌, 로그인시 displayNiockName이 추가됌
    //cookie: { secure: true }
  }));
app.use(passport.initialize());
app.use(passport.session());
//여기 있는 session코드는 app.use(session)코드 아래 존재해야 함
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
    res.redirect('/welcome');
});
passport.serializeUser(function(user, done) {
    done(null, user.username);
  });
  
  passport.deserializeUser(function(id, done) {
    let user = {
        username:'Lsm',
        password:'1234',
        displayName:'nickNameLSM'
    }; 
        if(user.username ===id)
            done(null, user);
    
  });
passport.use(new LocalStrategy(
    (username,password,done)=>{
        let user = {
            username:'Lsm',
            password:'1234',
            displayName:'nickNameLSM'
        }; 
    let uname=username;
    let pwd =password;
    if(uname === user.username){
        done(null,user);
    }else{
        done(null,false);
    }
    done(null,false);
    }
));
app.post('/auth/login',passport.authenticate('local',{
    successRedirect:'/welcome',
    failureRedirect:'/auth/login',
    failureFlash:false
}))
// app.post('/auth/login',(req,res)=>{
//     let user = {
//         username:'Lsm',
//         password:'1234',
//         displayName:'nickNameLSM'
//     }; //DB대신 직접박음 , 소스코드에 비번이 있는경우 굉장히 안좋은 방식
//     let uname=req.body.username;
//     let pwd =req.body.password;
//     if(uname === user.username && pwd ===user.password){
//         req.session.displayName = user.displayName;
//         res.redirect('/welcome');
//     }else{
//         res.send('who are you?<a href="/auth/login>Login</a>');
//     }
// });
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
