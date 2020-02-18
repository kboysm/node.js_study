let user = require('./user4');
showUser=()=>{
return user().name+','+'no group';
}
console.log(showUser());