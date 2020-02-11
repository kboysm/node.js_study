
let person ={};
person.name;
person["age"]=25;
person.name="한여름";
console.log(person.name);
console.log(person["age"]);

let add=(a,b)=>{return a+b};
let result = add(10,10);
console.log(result);
person.add=(a,b)=>{return a+b};
console.log(person.add(10,30));