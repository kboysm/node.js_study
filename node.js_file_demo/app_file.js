let express = require('express');
let bodyParser = require('body-parser');
let fs = require('fs');
let app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.locals.pretty=true;
app.set('views','./views');
app.set('view engine','jade');
app.get('/topic/new',(req,res)=>{
    fs.readdir('data',(err,files)=>{
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        res.render('new',{topics:files});
    });
});
app.get(['/topic','/topic/:id'],(req,res)=>{
    fs.readdir('data',(err,files)=>{
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        let id = req.params.id;
        if(id){        //id값이 있을 때
            fs.readFile('data/'+id,'utf-8',(err,data)=>{
                if(err){
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                }
                res.render('view',{topics:files,title:id,description:data});
            });
        }else{        //id값이 없을 때
            res.render('view',{topics:files,title:'Welcome',description:'Hello JavaScript for Server.'});
        }
    });
});
// app.get('/topic/:id',(req,res)=>{
//     let id = req.params.id;

//     fs.readdir('data',(err,files)=>{
//         if(err){
//             console.log(err);
//             res.status(500).send('Internal Server Error');
//         }
//         fs.readFile('data/'+id,'utf-8',(err,data)=>{
//             if(err){
//                 console.log(err);
//                 res.status(500).send('Internal Server Error');
//             }
//             res.render('view',{topics:files,title:id,description:data});
//         });
//     });
// }); 코드 중복으로 인해 위의 app.get의 url 값을 배열처리하여 하나로 합침
app.post('/topic',(req,res)=>{
    let title = req.body.title;
    let description = req.body.description;
    fs.writeFile('data/'+title,description,(err)=>{
        if(err){
            res.status(500).send('Internal Server Error');
        }
        res.redirect('/topic/'+title);
    });
})
app.listen(3000,()=>{
    console.log("Connected , 3000 Port");
});
