let express = require('express');
let app = express();
//라우트의 개수가 많아지면 서로 연관있는 라우트끼리 파일별로 쪼개서
//관리해야 한다. Route-level-middleware 알기
let p1  =require('./routes/p1')(app);//app객체 전달
app.use('/p1',p1);
//p1이라는 경로로 들어오는 모든 접근은 p1라우터에게 위임
let p2 = require('./routes/p2')(app);
app.use('/p2',p2);
app.listen(3003,()=>{
    console.log('Connected 3003 Port!!');
});