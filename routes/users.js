import express from 'express';
import { v4 as uuidv4} from 'uuid'
uuidv4();

const router = express.Router();

let users= []

router.get('/', (req, res)=> {
  res.send(users);
})

router.post('/',(req, res)=> {
  const user = req.body
  const userWithId = {
    ...user,
    id: uuidv4()
  }

  users.push(userWithId)
  res.send(users);
})

router.get('/:id',(req, res) => {
  const { id } = req.params;

  const user = users.find( (user) => user.id === id);
  res.send(user)
})

router.delete('/:id', (req, res)=> {
  const { id } = req.params;
  users = users.filter( (user) => user.id !== id);
  res.send(' success delete user')
})

router.patch('/:id',(req, res) => {
  const { id } = req.params;
  const { name, age, address } = req.body;
  const user = users.find( (user)=> user.id === id);

  if(name) user.name = name;
  if(age) user.age = age;
  if(address) user.address = address;
  
  res.send(`User with the id ${id} has been updated`);

})
export default router;