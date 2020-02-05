let express = require('express');
let bodyParser = require('body-parser');
let multer = require('multer');
let _storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
})
let upload = multer({storage:_storage})
let fs = require('fs');
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
app.locals.pretty=true;
app.set('views','./views_mysql');
app.set('view engine','jade');
app.get('/topic/add',(req,res)=>{
    let sql = 'select id,title from topic';
    conn.query(sql,(err,topics,fields)=>{
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        res.render('add',{topics:topics});
    });
});
app.post('/topic/add',(req,res)=>{
    let title = req.body.title;
    let author = req.body.author;
    let description = req.body.description;
    let sql = "insert into topic (title,description,author) values(?,?,?)";
    conn.query(sql,[title,description,author],(err,result,fields)=>{
        if(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }else{
            res.redirect('/topic/'+result.insertId);
        }
    });
})
app.get(['/topic','/topic/:id'],(req,res)=>{
    let sql = 'select id,title from topic';
    conn.query(sql,(err,topics,fields)=>{
        let id = req.params.id;
        if(id){
            let sql = 'select * from topic where id=?'
            conn.query(sql,[id],(err,topic,fields)=>{
            if(err){
                console.log(err);
                res.status(500).send('Internal Server Error');
            }else{
                res.render('view',{topics:topics,topic:topic[0]});
            }
            });
        }else{
            res.render('view',{topics:topics});
        }
    });
});
app.listen(3000,()=>{
    console.log("Connected , 3000 Port");
});
