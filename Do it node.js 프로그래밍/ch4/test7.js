let fs = require('fs');
let infile = fs.createReadStream('./lsm.txt',{flags:'r'}); //{flags:'r'} r은 read로 읽기 권한을 준다는 의미
//파일을 읽는 과정에서 이벤트가 발생함

infile.on('data',(data)=>{ //읽힌 파일이 data로 들어옴
    console.log('읽어진 데이터 : '+data);
})

infile.on('end',()=>{ //파일을 다 읽었을때 발생하는 이벤트
    console.log('읽는 과정이 끝남');
})
