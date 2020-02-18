//virtual test하기 위한 파일
let mongoose= require('mongoose');
let database;
let UserSchema;
let UserModel;

connectDB=()=>{
    let databaseurl = 'mongodb://localhost:27017/local';

    mongoose.Promise = global.Promise;
    mongoose.connect(databaseurl);
    database = mongoose.connection;

    createUserSchema();
    doTest();
}

/*
UserSchema.static('findAll',function(callback){ //모델객체에서 사용할 수 있는 메서드를 등록
            return this.find({},callback);
        })
*/
createUserSchema =()=>{
    UserSchema=mongoose.Schema({
        id : {type:String , required:true,unique:true},
        name : {type:String,index:'hashed'},
        age:{type:Number,'default':-1},
        created_at:{
            type:Date,
            index:{unique:false},
            'default':Date.now(),
        },
        updated_on:{
            type:Date,index:{unique:false},
            'default':Date.now()
        }
    }); 
    console.log('UserSchema 정의.');
    UserSchema.virtual('info')
    .set(function(info){
        let splitted = info.split(' ');
        this.id= splitted[0];
        this.name=splitted[1];
        console.log('virtual info 설정 완료'+this.id);
    })
    .get(function(){
        return this.id+" "+this.name;
    });
    UserModel = mongoose.model("users4",UserSchema);
    console.log("UserModel 정의");
};
doTest=()=>{
    let user = new UserModel({'info':"test03 LSM"});
    user.save((err)=>{
        if(err){
            console.log(err);
            return;
        }
        console.log("데이터 추가");
    });

}
connectDB();
