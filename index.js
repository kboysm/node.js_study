import express from 'express';
import bodyParser from 'body-parser';
import usersRouters from './routes/users.js';

const app = express();
const PORT= 5000;
app.use(bodyParser.json());
app.use('/users', usersRouters);


app.get('/',(req, res)=> 
  res.send('get request')
)

app.listen(PORT, () => console.log(` port: ${PORT}`));