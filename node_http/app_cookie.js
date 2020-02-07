let express = require('express');
let cookieParser = require('cookie-parser');
let app = express();
app.use(cookieParser()); //app에서 쿠키파써를 사용!
app.get('/count',(req,res)=>{
    let count;
    if(req.cookies.count){
         count = parseInt(req.cookies.count);
    }
    else{
         count =0;
    }
    count=count+1;
    res.cookie('count',count); //쿠키이름 , default값
    res.send('count : '+count);
});
app.listen(3003,()=>{
    console.log('Connected 3003 port!!!');
});
//express는 쿠키관련 기능을 기본적으로 제공하지 않아서 깔아야 한다. ->npm i cookie-parser