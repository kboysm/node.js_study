function User(id,name){
    this.id=id;
    this.name=name;
}//proto 객체를 만드는 생성자
User.prototype.getUser = function(){
    return {id:this.id , name : this.name};
}
User.prototype.group = {id:'group01',name:'kkk'};

User.prototype.printUser = function(){
    console.log('user 이름 : '+this.name+", group : "+this.group.name);
}

module.exports = new User('test01','LSM');