let express = require('express');
let bodyParser = require('body-parser');
let session = require('express-session'); //기본적으로 세션은 메모리에 저장해둠. app을 껏다키면 날라감
let app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
    secret: '123JOPJ@#$%1269',
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: true }
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
    res.redirect('/welcome');
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
