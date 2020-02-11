//test2는 안만듬
let names =['성동구','강남구','영등포구'];
let users =[{name:"홍길동",age:50},{name:'이순신',age:60}];
//초기화를 선언과 동시에 해준 경우임
users.push({name:"박지성",age:35});
console.log('사용자 수 : '+users.length); //배열 객체는 자동으로 length가 존재
names.map(item =>console.log(item));
for(let i in users){console.log("name: "+users[i].name+" age: "+users[i].age)};
let add=(a,b)=>{return a+b;}
names.push(add);
console.log(names[3](10,10));