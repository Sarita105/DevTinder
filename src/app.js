const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();

app.use(express.json());

app.post('/signUp', async (req, res) => {
  const user = new User(req.body);
  try{
   await user.save();
   res.send('user added successfully')
  } catch(err){
    res.status(400).send('Error saving user data:'+err.message);
  }

})
connectDB().then(() => {
  console.log('database connected successfully.');
  app.listen(7777, () => {
  console.log('server is listing on port 7777...');
});
}).catch((err) =>{
  console.log('cannot connect to database.', err);
});
