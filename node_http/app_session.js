let express = require('express');
let session = require('express-session'); //기본적으로 세션은 메모리에 저장해둠. app을 껏다키면 날라감
let app = express();
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
app.get('/auth/login',(req,res)=>{
    let output=`
    <form action="/auth/login" method="post">
        <p>
            <input type="text" name="id" placeholder="username">
        </p>
        <p>
            <input type="password" name="password" placeholder="password">
        </p>
        <p>
            <input type="submit" value="제출">
        </p>
    </form>
    `;
    res.send('hello login');
});

app.listen(3003,()=>{
    console.log('Connected 3003 port!!!');
});
