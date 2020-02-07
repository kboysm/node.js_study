let express = require('express');
let cookieParser = require('cookie-parser');
let app = express();
app.use(cookieParser('51615651SDSA!@#$')); //app에서 쿠키파써를 사용! ,cookieParser에 암호인자를 넣어 쿠키를 암호화 시킬 수 있다.
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
app.get('/cart',(req,res)=>{
    let cart = req.signedCookies.cart;
    let output='';
    if(!cart){
        res.send('Empty');
    }else{
        for(let id in cart){
            output +=`<li>${products[id].title} (${cart[id]}개)</li>`;
        }
    }
    res.send(`
    <h1>Cart</h1>
    <ul>${output}</ul>
    <a href="/products">Products List</a>`
    );
});
app.get('/cart/:id',(req,res)=>{
    let id = req.params.id;
    let cart;
    if(req.signedCookies.cart){
        cart =req.signedCookies.cart;
    }else{
        cart ={};
    }
    if(!cart[id]){
        cart[id]=0; 
    }
    cart[id]=parseInt(cart[id])+1; 
    res.cookie('cart',cart,{signed:true});
    res.redirect('/cart');
});
/*
cart={

}
*/




app.get('/count',(req,res)=>{
    let count;
    if(req.signedCookies.count){
         count = parseInt(req.signedCookies.count); //signedCookies ->Cookie를 암호화시킴 ,cookieParser('51615651SDSA!@#$')키값으로 지정해 놔서 가능
    }
    else{
         count =0;
    }
    count=count+1;
    res.cookie('count',count,{signed:true}); //쿠키이름 , default값
    res.send('count : '+count);
});
app.listen(3003,()=>{
    console.log('Connected 3003 port!!!');
});
//express는 쿠키관련 기능을 기본적으로 제공하지 않아서 깔아야 한다. ->npm i cookie-parser
//cookie는 사용자의 웹브라우저에 저장되므로 해킹이 될 가능성이 높다! 위험하다!
/*
그래서 https를 사용하는게 좋다.
또 쿠키값 자체를 암호화를 할 수 있다. 
 */