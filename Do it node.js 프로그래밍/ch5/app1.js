let express = require('express');
let http = require('http');
let app = express();
app.set('port',process.env.PORT || 1234);
let server= http.createServer(app).listen(app.get('port'),()=>{
    console.log('express web server'+app.get('port'));
});