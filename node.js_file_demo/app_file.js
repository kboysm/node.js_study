let express = require('express');
let app = express();
app.locals.pretty=true;
app.set('views','./views');
app.set('view engine','jade');
app.get('/topic/new',(req,res)=>{
    res.render('new');
});
app.post('/topic',(req,res)=>{
    res.send('topic hi')
})
app.listen(3000,()=>{
    console.log("Connected , 3000 Port");
});
