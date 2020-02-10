let express = require('express');
let bodyParser = require('body-parser');
let session = require('express-session'); //기본적으로 세션은 메모리에 저장해둠. app을 껏다키면 날라감
let MySQLStore = require('express-mysql-session')(session);
let bkfd2Password = require("pbkdf2-password");
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let FacebookStrategy = require('passport-facebook').Strategy;
let hasher = bkfd2Password();
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
  app.use(passport.initialize());
app.use(passport.session());
let user = 
[{
    authId:'local:Lsm',
    username:'Lsm',
    password:'8Y5Hg2OnCv8nJgCs2Mo+c8MYCFcedZxC6TUmy7W5kMPY+O0NKOO+bcjh5ofUAIF9SlpD9af36WkqqLlPcUSydVntnhXSkHM6wx+cmOOPEWZ7V3/MgaSwSSiNEwYhnBoQ9QtG/DLnuIYcD7004RbdKLbK856Hl24RVUl1cPczVPo=',
    salt : 'J5qJREh1sj68/Bbj+ZJaxc1Y1QKAPpy18UKFUO2rkgH1S8up39lLRUqx9nnmpfGa5uKlCPp3diG11H/KBgY2oQ==', //사용자의 각각의 salt값을 다르게하면 설령 비번이 동일한 사용자가 있더라도 password의 값이 다르다
    displayName:'nickNameLSM'
}];
passport.serializeUser(function(user, done) {
    done(null, user.authId);
  });
  
  passport.deserializeUser(function(id, done) {
    for(let i=0 ; i<user.length;i++){
        let u = user[i];
        if(u.authId ===id){
            return done(null,u);
        }
    }      
    done('There is no user');
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
    //이 부분에 done함수가 또 들어가면 콜백함수 에러가 발생
    }
));
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID, //노출하면 안돼서 이렇게
    clientSecret: FACEBOOK_APP_SECRET, //이것두
    callbackURL: "/auth/facebook/callback",
    profileFields:['id','email','gender','name','displayName'] //명시적으로 해줘야 facebook에서 해당 정보를 던져줄때 받을 수 있음
  },
  function(accessToken, refreshToken, profile, done) {

      console.log(profile);
      let authId = 'facebook:'+profile.id; //페이스북의 고유 아이디값으로 이사람을 식별하겠다.
      for(let i=0; i<user.length;i++){
          let u =user[i];
          if(u.authId ===authId){
            return done(null,u);
          }
      }
      let newuser =
        {
            'authId':authId,
            'displayName':profile.displayName,
            'email':profile.emails[0].value
        };
      
      user.push(newuser);
      done(null,newuser);
  }
));
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
app.get('/auth/facebook',
 passport.authenticate(
     'facebook',{
         scope:'email'
     }
     )
    );
app.get('/auth/facebook/callback',
 passport.authenticate(
     'facebook',{
         successRedirect:'/welcome',
         failureRedirect:'/auth/login',

     }
    )
);

app.post('/auth/login',passport.authenticate('local',{
    successRedirect:'/welcome',
    failureRedirect:'/auth/login',
    failureFlash:false
}));
app.post('/auth/register',(req,res)=>{
    hasher({password:req.body.password},(err,pass,salt,hash)=>{
        let uu = {
            authId:'local:'+req.body.username,
            username:req.body.username,
            password:hash,
            salt:salt,
            displayName:req.body.displayName
        };
        user.push(uu);
        req.session.displayName = req.body.displayName;
        req.session.save(()=>{
            res.redirect('/welcome');
        });
    });

});
app.get('/auth/register',(req,res)=>{
    let output=`
    <h1>Register</h1>
    <form action="/auth/register" method="post">
        <p>
        <input type="text" name="username" placeholder="username">
        </p>
        <p>
        <input type="password" name="password" placeholder="password">
        </p>
        <p>
        <input type="text" name="displayName" placeholder="nickName">
        </p>
        <p>
        <input type="submit">
        </p>
    </form>
    `;
    res.send(output);
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
    <a href="/auth/facebook">facebook</a>
    `;
    res.send(output);
});

app.listen(3003,()=>{
    console.log('Connected 3003 port!!!');
});
