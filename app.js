let express = require('express');
let app =express();
app.use(express.static('public'));//public이라는 디렉토리를 정적인 파일의 위치로 고정하겠다라는 의미.. 정적서비스를 할때 써야함
//url에 public/c1.jpg라고 안하고 /c1.jpg라고 해도 public의 c1.jpg파일이 나옴
app.get('/',(req,res)=>{ //req,res는 약속임
    res.send('Hello home page');
}); //사용자가 웹서버에 접속할때는 get,post방식으로 접속하는데 일반적으로 url을 치고들어오는것은 get방식이므로 get메서드를 사용해서 받아드림
app.get('/route',(req,res)=>{
    res.send('Hello Router <img src="/c1.jpg"></img>')
});
app.get('/login',(req,res)=>{ //get이라는 메서드를 보통 라우터라고 부른다, 또 우리가 get메서드를 가지고 이렇게 만드는것을 라우팅이라고 한다.
    res.send('Login please');
});
app.listen(3000,()=>{
    console.log("Connected 3000 port!");
});