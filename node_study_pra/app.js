let express = require('express');
let bodyParser = require('body-parser'); //바디파서라는 모듈을 가져오고!
let app =express();
app.locals.pretty =true;
app.set('views','./views'); //관습적으로 jade파일은 views라는 폴더안에 넣는다.
app.set('view engine','jade'); //view engine을 jade로 하겠다 라는 의미
app.use(express.static('public'));//public이라는 디렉토리를 정적인 파일의 위치로 고정하겠다라는 의미.. 정적서비스를 할때 써야함
//url에 public/c1.jpg라고 안하고 /c1.jpg라고 해도 public의 c1.jpg파일이 나옴
app.use(bodyParser.urlencoded({extended:false}))//모든 요청을 먼저 받아서 get,post인지 판단하고 개발자가 사용할수 있도록 해줌
app.get('/form',(req,res)=>{
    res.render('form');
});
app.get('/form_receiver',(req,res)=>{
    let title =req.query.title;
    let description = req.query.description;
    res.send(title+','+description);
});
app.post('/form_receiver',(req,res)=>{ //express에서 post data는 기본적으로 undefined이므로 사용하기 위해서는 body-parser가 필요함
    //req.body는 바디파서 모듈을 다운받고 use해 주지 않으면 사용못함
    let title =req.body.title;
    let description = req.body.description;
    res.send(title+','+description);
});
app.get('/topic/:id',(req,res)=>{ // /topic?id=1 ->쿼리스트링 , /topic/1 -> semantic url
    let topics =[
        'Javascript is ...',
        'Node.js is ...',
        'Express is...'
    ];
    let output=`
        <a href='/topic/0'>JavaScript</a><br>
        <a href='/topic/1'>Node.js</a><br>
        <a href='/topic/2'>Express</a><br><br>
        ${topics[req.params.id]}
    `
    //${topics[req.query.id]} 이녀석은 쿼리스트링용 ,${topics[req.params.id]}는 시멘틱 url용
    res.send(output); //query String으로 전달되는 변수를 query.변수명으로 해주면 됨,복수개를 받을 수 있음
});
app.get('/topic/:id/:mode',(req,res)=>{
    res.send(req.params.id+','+req.params.mode);
});
app.get('/template',(req,res)=>{
    
    res.render('temp',{time:Date(),title:'jade 재밌당'}); //랜더링 : 소스코드를 가져와서 화면을 만드는 과정 ,이 명령은 랜더링을 하는 명령
});
app.get('/',(req,res)=>{ //req,res는 약속임
    res.send('Hello home page');
}); //사용자가 웹서버에 접속할때는 get,post방식으로 접속하는데 일반적으로 url을 치고들어오는것은 get방식이므로 get메서드를 사용해서 받아드림
app.get('/dynamic',(req,res)=>{
    let lis ='';
    let time =Date();
    for(let i=0;i<5;i++){
        lis += '<li>coding</li>';
    }
    let output = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
    </head>
    <body>
        Hello Dynamic
        <ul>
        ${lis}
        </ul>
        ${time}
    </body>
    </html>`; //``을 써야함
    res.send(output);
});
app.get('/route',(req,res)=>{
    res.send('Hello Router <img src="/c1.jpg"></img>')
});
app.get('/login',(req,res)=>{ //get이라는 메서드를 보통 라우터라고 부른다, 또 우리가 get메서드를 가지고 이렇게 만드는것을 라우팅이라고 한다.
    res.send('Login please');
});
app.listen(3000,()=>{
    console.log("Connected 3000 port!");
});
//정적인 파일을 전달하는법,
//동적인 파일을 전달하는법 두개를 알아야함