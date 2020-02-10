let express = require('express');
let app = express();
app.set('view engine','jade');
app.set('views','jade');
app.get('/view',(req,res)=>{
    res.render('view');
});
app.get('/add',(req,res)=>{
    res.render('add');
});
app.listen(3003,()=>{
    console.log('Connect 3003 port');
})