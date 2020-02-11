let fs =require('fs');
fs.writeFileSync("food.txt","자바스크립트 맛있다!");
console.log(fs.readFileSync("food.txt").toString());