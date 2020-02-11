
module.exports = (app)=>{
    let express = require('express');
let route = express.Router();
route.get('/r1',(req,res)=>{
    res.send('hello p1,r1');
});
route.get('/r2',(req,res)=>{ //원래 /p1/r2였는데 지움
    res.send('hello p1,r2');
});
    app.get('/p3/r1',(req,res)=>{
    res.send('Hello /p3/r1'); 
    });
    return route;
};