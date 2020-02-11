// let fun = (a)=>{console.log(a)};
// let func = (a,b,c)=>{
//     let result =a+b;
//     c(result);
// }
// func(1,2,fun);

let fun = (a)=>{console.log(a)};
let func = (a,b,c)=>{
    let result =a+b;
    let count =0;
    c(result);
    let his = ()=>{
        return count+"번째 ->>"+a+ "+"+b+"="+result;
    };
    return his;
}
let res =func(1,2,fun);
console.log(typeof(res));
console.log(res());
