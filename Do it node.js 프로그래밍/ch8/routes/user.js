
let login = 
(req,res)=>{
    console.log('/process/login 라우팅 함수 호출')
    let paramId = req.body.id || req.query.id;
    let paramPassword = req.body.password || req.query.password;
    console.log('요청 파라미터 : '+paramId + ', '+ paramPassword);
    let database = req.app.get('database');
    if(database){
        authUser(database,paramId,paramPassword,(err,docs)=>{
            if(err){
                console.log('에러발생');
                res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>err발생</h1>');
                res.end();
                return;
            }
            if(docs){
                console.dir(docs);
                res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>login  성공</h1>');
                res.write('<div><p>사용자 : '+docs[0].name+'</p></div>');
                res.write('<br><br><a href="/public/login.html">다시 로그인하기</a>');
                res.end();
                
            }else{
                console.log('에러발생');
                res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 데이터가 조회 안됨</h1>');
                res.end();
                
            }
        });
    }else{
        console.log('에러발생');
                res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>mongodb 연결 실패</h1>');
                res.end();
    }
}

let adduser =(req,res)=>{
    console.log('/process/adduser 라우팅 함수 호출');
    let paramId = req.body.id || req.query.id;
    let paramPassword = req.body.password || req.query.password;
    let paramName = req.body.name || req.query.name;
    console.log("요청 파라미터 "+paramId+" , "+paramPassword+" , "+paramName);
    let database = req.app.get('database');
    if(database){
        addUser(database,paramId,paramPassword,paramName,(err,result)=>{
            if(err){
                console.log('에러발생');
                res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>err발생</h1>');
                res.end();
                return;
            }
            if(result){
                console.dir(result);
                res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 추가 성공</h1>');
                res.write('<div><p>사용자 : '+paramName+'</p></div>');
                res.end();
            }else{
                console.log('에러발생');
                res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 추가 안됨</h1>');
                res.end();
            }
        })
    }else{
        console.log('에러발생');
                res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>데이터베이스 연결 안됨</h1>');
                res.end();
    }
};
let listuser = (req,res)=>{
    console.log('/process/listuser 라우팅 함수 호출');
    let database = req.app.get('database');
    if(database){
        database.UserModel.findAll((err,results)=>{
            if(err){
                console.log('findAll 에러발생')
                res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>에러 발생</h1>');
                res.end();
                return;
            }
            if(results){
                console.dir(results);
                res.writeHead(200,{
                    "Content-Type":"text/html;charset=utf8"});
                    res.write('<h3>사용자 리스트</h3>');
                    res.write('<div><ul>');
                    results.forEach((result,i) =>{
                        res.write("<li>#"+i+"->"+result._doc.id+", "+result._doc.name+"</li>");
                    })
                    res.write("</ul></div>");
                    res.end();
            }else{
                console.log('에러 발생.');
                res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>조회된 사용자 없음.</h1>');
                res.end();
            }
        })
    }else{
        console.log('에러발생');
        res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
        res.write('<h1>데이터베이스에 연결 안됨</h1>');
        res.end();
    }
};


let authUser = function(db,id,password,callback){
    console.log('authUser 호출 : '+id+","+password);
    db.UserModel.findById(id,(err,results)=>{
        if(err){
            callback(err,null);
            return;
        }
        if(results.length >0){
            let user=new UserModel({id:id});
            let authenticated = user.authenticate(password,results[0]._doc.salt,
                results[0]._doc.hashed_password);
            if(authenticated){
                console.log('비밀번호 일치함');
                callback(null,results);
            }else{
                console.log('비밀번호가 일치하지 않음');
                callback(null,null);
            }
        }else{
            console.log('아이디가 일치하는 사용자가 없음');
            callback(null,null);
        }
    });
};
let addUser = (db,id,password,name,callback)=>{
    console.log('add User 호출'+id+" , "+password+" , "+name);
    let user= new db.UserModel({"id":id,"password":password,"name":name});
    user.save((err)=>{
        if(err){
            callback(err,null);
            return;
        }
        console.log('사용자 데이터 추가함');
        callback(null,user);
    });
}


module.exports = listuser;
module.exports = adduser;
module.exports = login;
