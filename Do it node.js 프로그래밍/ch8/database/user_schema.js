let crypto = require('crypto');

let Schema ={};

Schema.createSchema =function(mongoose) {
    console.log('create Schema 호출됨')
    let UserSchema=mongoose.Schema({
        id : {type:String , required:true,unique:true,
        'default':''},
        hashed_password : {type:String,required:true,
        'default':''},
        salt:{type:String,required:true},
        name : {type:String,index:'hashed','default':''},
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

    UserSchema.virtual('password')
    .set(function(password){
        this.salt = this.makeSalt();
        this.hashed_password=this.encryptPassword(password);
        console.log("virtual password 저장됨 : "+this.hashed_password);
    })
    UserSchema.method('encryptPassword',function(plainText,inSalt){
        if(inSalt){
            return crypto.createHmac('sha1',inSalt).update(plainText).digest('hex');
        }else{
            return crypto.createHmac('sha1',this.salt).update(plainText).digest('hex');
        }
    });
    UserSchema.method('makeSalt',function(){
        return Math.round((new Date().valueOf()*Math.random()))+'';
    })

    UserSchema.method('authenticate',function(plainText,inSalt,hashed_password){
        if(inSalt){
            console.log('authenticate 호출');
            return this.encryptPassword(plainText,inSalt)===hashed_password;
        }else{
            console.log('authenticate 호출됨');
            return this.encryptPassword(plainText)===hashed_password;
        }
    })
    //주의 스키마에서 정의한 함수를 model객체에서 사용 할 수 있다.
    UserSchema.static('findById',function(id,callback){ //모델객체에서 사용할 수 있는 메서드를 등록
        return this.find({id:id},callback);
    })
    UserSchema.static('findAll',function(callback){ //모델객체에서 사용할 수 있는 메서드를 등록
        return this.find({},callback);
    })
    return UserSchema;
}

module.exports =Schema;