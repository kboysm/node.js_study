let output = '안녕!';
let buf = new Buffer(10); //버퍼의 길이를 10으로
let len = buf.write(output,'utf8')//몇개를 write 했는지를 리턴함
console.log('몇개가 쓰여졌는지 : '+len);
console.log('내용 : '+buf.toString());

//다른 사람이 만든 것을 사용할 때 버퍼인지 아닌지 확인할 때 사용함
console.log('버퍼 인지 아닌지 알아보려면! --> Buffer.isBuffer(buf) 결과는? : '+Buffer.isBuffer(buf)); 

let byteLen = Buffer.byteLength(buf);
console.log(byteLen); //버퍼의 생성 길이를 알 수 있음

let Str=buf.toString('utf-8',0,7); //버퍼안의 내용을 가져옴 utf-8방식으로 0부터 7번째까지 가져오겠다!
console.log(Str);

let buf2=Buffer.from('hello','utf8');
console.log('buf2의 길이 : '+Buffer.byteLength(buf2));

let qwe =buf2.toString('utf8',0,Buffer.byteLength(buf2));
console.log(qwe);