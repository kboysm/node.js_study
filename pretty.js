function hello(name){
    console.log('Hi,'+name);
}
hello('Lsm');

//컴퓨터에서는 띄어쓰기 줄바꿈 등등이 다 데이터이다. 그래서 코드의 내용이 많아지면 비싸지고 느려진다 -> 최소화 필요 -> uglify.js로 필수적인 코드만 남기게 한다.
//명령은 해당 디렉토리에서 uglify pretty.js -m 을 해주면 펑션의 name이 o로 바뀐다. 지역변수같은 이름을 바꿔도 상관이 없는 녀석들을 한글자의 가장 짧은 글자로 압축한다.
//실제로 파일로 저장하는 법 uglifyjs pretty.js pretty.min.js -m 으로 저장한다.
// 파일 이름에 min이 붙은것은 작게 만든 파일이라는 뜻 최소화된 파일이라는 약속