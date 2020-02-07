let express = require('express');
let cookieParser = require('cookie-parser');
let app = express();
app.use(cookieParser()); //app에서 쿠키파써를 사용!
let products={
    1:{title:'The history of web 1'},
    2:{title:'The next web'}
};//db대신 배열을 만듬 , 실무에서는 이부분이 db라고 생각하면 된다.
app.get('/products',(req,res)=>{
    let output = '';
    for(let name in products){
        output +=`<li>
        <a href="/cart/${name}">${products[name].title}</a>
        </li>`;
    }
    res.send(`<h1>Products</h1><ul>${output}</ul><a href="/cart">Cart</a>`);
});
app.get('/cart/:id',(req,res)=>{
    let id = req.params.id;
    let cart;
    if(req.cookies.cart){
        cart =req.cookies.cart;
    }else{
        cart ={};
    }
    if(!cart[id]){
        cart[id]=0; 
    }
    cart[id]=parseInt(cart[id])+1; 
    res.cookie('cart',cart);
    res.redirect('cart');
});
/*
cart={

}
*/




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