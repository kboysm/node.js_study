let users =[{name:"홍길동",age:50},{name:'이순신',age:60}];
console.log('배열 원소의 개수 : '+users.length);

users.push({name:"임꺽정",age:66});
console.log('배열 원소의 개수 : '+users.length);

let popElem=users.pop();
console.dir(popElem);
users.unshift({name:"사람인",age:66}); //배열의 가장 앞에 해당 객체를 추가
popElem=users.shift(); //배열의 가장 앞의 객체를 가져옴
console.dir(popElem);

delete users[0];
console.dir(users);
users.splice(0,0,{name:"기룡성",age:28}); // 가장 앞부분에 ,추가하겠다,해당객체를
console.dir(users);
users.splice(1,1); //2번째 인자부터, 1개를 삭제하겠다.
console.dir(users);

//let users_copy = users.slice(0); 0번째부터 끝까지 복제
let users_copy = users.slice(0,2); //0번째부터 2개만 복제
console.dir(users_copy);