import { v4 as uuidv4} from 'uuid'
let users= [];


export const getUsers = (req, res) => {
  res.send(users);
}

export const createUser = (req, res) => {
  const user = req.body;

  users.push({ ...user, id: uuidv4()});

  res.send(`User with the name ${user.name} added to the database`);
}

export const getUser = (req, res) => {
  const { id } = req.params;

  const user = users.find( (user) => user.id === id);
  res.send(user)
};

export const deleteUser = (req, res)=> {
  const { id } = req.params;
  users = users.filter( (user) => user.id !== id);
  res.send(' success delete user')
}

export const patchUser = (req, res) => {
  const { id } = req.params;
  const { name, age, address } = req.body;
  const user = users.find( (user)=> user.id === id);

  if(name) user.name = name;
  if(age) user.age = age;
  if(address) user.address = address;
  
  res.send(`User with the id ${id} has been updated`);

}