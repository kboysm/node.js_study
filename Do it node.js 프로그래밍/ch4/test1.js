let url=require('url');

//클라이언트에서 웹서버로 요청한 정보
let urlStr ='https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=asd'; 

//parse해주면 객체를 리턴함
let parUrl=url.parse(urlStr);console.dir(parUrl);
console.log(parUrl.query);

//객체 형태를 다시 url로 만듬
let strUrl = url.format(parUrl); 
console.log(strUrl);

//사용자가 검색한 검색어를 알 수 있음
let querystring=require('querystring'); 
let params = querystring.parse(parUrl.query);
console.log(params);