let express = require('express');
let session = require('express-session'); //기본적으로 세션은 메모리에 저장해둠. app을 껏다키면 날라감
let MySQLStore = require('express-mysql-session')(session);
let bodyParser = require('body-parser');
let bkfd2Password = require("pbkdf2-password");
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let hasher =bkfd2Password();
let app = express();
let mysql = require('mysql');
let conn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '1234',
    database : 'o2'
});
conn.connect();
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
    })
  }));
app.use(passport.initialize());
app.use(passport.session());
let users = 
[{
    username:'Lsm',
    password:'8Y5Hg2OnCv8nJgCs2Mo+c8MYCFcedZxC6TUmy7W5kMPY+O0NKOO+bcjh5ofUAIF9SlpD9af36WkqqLlPcUSydVntnhXSkHM6wx+cmOOPEWZ7V3/MgaSwSSiNEwYhnBoQ9QtG/DLnuIYcD7004RbdKLbK856Hl24RVUl1cPczVPo=',
    salt : 'J5qJREh1sj68/Bbj+ZJaxc1Y1QKAPpy18UKFUO2rkgH1S8up39lLRUqx9nnmpfGa5uKlCPp3diG11H/KBgY2oQ==', //사용자의 각각의 salt값을 다르게하면 설령 비번이 동일한 사용자가 있더라도 password의 값이 다르다
    displayName:'nickNameLSM'
}];
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
    req.logout();
    req.session.save(()=>{
        res.redirect('/welcome');
    });
});
passport.serializeUser(function(user, done) {
    done(null, user.authId);
  });
  
  passport.deserializeUser(function(id, done) {
      let sql = "select * from users where authId=?";
      conn.query(sql,[id],(err,results)=>{
        console.log(sql,err,results);
        if(err){
            console.log(err);
            done("There is no user");
        }else{
            done(null,results[0]);
        }
    });
  });
passport.use(new LocalStrategy(
    (username,password,done)=>{
    let uname=username;
    let pwd =password;
    let sql ='select * from users where authId=?';
    conn.query(sql,['local:'+uname],(err,result)=>{
        console.log(result);
        if(err){
            console.log(err);
            return done('There is no users');
        }
        let user = result[0];
        return hasher({password:pwd,salt:user.salt},(err,pass,salt,hash)=>{
            if(hash ===user.password){
                console.log('LocalStrategy',user);
                done(null,user);
            }else{
                done(null,false);
            }
        });
    });
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
          let u =users[i];
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
      
      users.push(newuser);
      done(null,newuser);
  }
));
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

app.get('/welcome',(req,res)=>{
    if(req.user && req.session.displayName){
        res.send(`
        <h1>hello,${req.session.displayName} </h1>
        <a href="/auth/logout">logout</a>
        `);
    }else{
        res.send(`
        <h1>Welcome</h1>
        <ul>
            <li><a href="/auth/login">Login</a></li>
            <li><a href="/auth/login">Login</a></li>
        </ul>
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
app.post('/auth/register',(req,res)=>{
    hasher({password:req.body.password},(err,pass,salt,hash)=>{
        let uu = {
            authId:'local:'+req.body.username,
            username:req.body.username,
            password:hash,
            salt:salt,
            displayName:req.body.displayName
        };
        let sql = 'insert into users set ?';
        conn.query(sql,uu,(err,result)=>{
            if(err){
                console.log(err);
                res.status(500);
            }else{
                req.login(uu,(err)=>{
                    req.session.save(()=>{
                        req.redirect('/welcome');
                    });
                })
                res.redirect('/welcome');
            }
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
app.listen(3003,()=>{
    console.log('Connected 3003 port!!!');
});
