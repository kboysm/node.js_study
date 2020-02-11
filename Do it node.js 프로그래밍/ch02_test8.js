let path=require('path');
let directories = ['users','lishal','lsm'];

let dirStr=directories.join();
console.log(dirStr);

let dirStr2 = directories.join(path.sep); //폴더관련 
console.log(dirStr2);

let dirStr3=path.join('/Users/Mars','Lsm.exe');
console.log(dirStr3);

let dirname=path.dirname(dirStr3); //경로만
console.log(dirname);

let basename = path.basename(dirStr3);//파일만
console.log(basename);

let extname = path.extname(dirStr3);//확장자만
console.log(extname); 