//객체지향적인 특성을 위해 prototype을 사용한다. 함수로 사용한다.
function person(name,age){ //생성자로 사용하는 함수 보통 첫글자를 대문자로 사용
    this.name=name;
    this.age=age;
};

person.prototype.printlsm=(a)=>{console.log(a)}; //속성을 추가 (함수로 추가했음)

let person3 = new person('사람인',25);
let person4 = new person('크레딧잡',29);

person3.printlsm(10);