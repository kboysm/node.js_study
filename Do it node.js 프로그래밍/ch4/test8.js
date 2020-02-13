//log file 만들기 winston 사용
let winston =require('winston');
let winstonDaily=require('winston-daily-rotate-file');//매일 다른 파일에 남기겠다!라고 할 때 필요
let moment = require('moment');//날짜,시간 관련

timeStampFormat=()=>{
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ');
}

let logger = winston.createLogger({//로거라는 객체를 만듬 , new (winston.Logger) -> winston.createLogger로 바뀜 ,stack overflow 참조
    //설정값이 들어옴
    transports:[
        new (winstonDaily)({
            name:'info-file',
            filename:'./log/server%DATE%.log',
            datePattern:'YYYY-MM-DD',
            colorize:false,
            maxsize:50000000,
            maxFiles:1000,
            level:'info',
            showLevel:true,
            json:false,
            timestamp:timeStampFormat
        }),
        new (winston.transports.Console)({
            name:'debug-console',
            colorize:true,
            level:'debug',
            showLevel:true,
            json:false,
            timestamp:timeStampFormat
        })
    ]
});

logger.debug('디버깅 메시지');
logger.error('에러 메시지');