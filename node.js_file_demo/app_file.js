let express = require('express');
let bodyParser = require('body-parser');
let fs = require('fs');
let app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.locals.pretty=true;
app.set('views','./views');
app.set('view engine','jade');
app.get('/topic/new',(req,res)=>{
    res.render('new');
});
app.post('/topic',(req,res)=>{
    let title = req.body.title;
    let description = req.body.description;
    fs.writeFile('data/'+title,description,(err)=>{
        if(err){
            res.status(500).send('Internal Server Error');
        }
        res.send('Success');
    });
})
app.listen(3000,()=>{
    console.log("Connected , 3000 Port");
});
