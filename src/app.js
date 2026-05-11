const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const { validateSignupData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());

app.get('/user', async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.findOne({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send('user not found');
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send('Something went wrong!');
  }
});

app.delete('/user', async (req, res) => {
  const userId = req.body._id;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send('user deleted successfully');
  } catch (err) {
    res.status(400).send('Something went wrong!');
  }
});
app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send('Something went wrong!');
  }
});

app.post('/signUp', async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    const hashedpassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedpassword,
    });

    validateSignupData(req);
   
    await user.save();
    res.send('user added successfully');
  } catch (err) {
    res.status(400).send('Error saving user data:' + err.message);
  }
});

app.post('/login', async (req, res) => {
  try{
    const { emailId, password } = req.body;
    
    const user = await User.findOne({emailId});
    console.log(emailId,password,user.password)
    if(!user){
      throw new Error('Invalid credentials')
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if(isValidPassword){
      res.send('login successful');
    }else{
      throw new Error('Invalid credentials')
    }
  } catch (err) {
    res.status(400).send('Error saving user data:' + err.message);
  }
})

app.patch('/user/:userId', async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATE = ['photoUrl', 'about', 'gender', 'age', 'skills'];
    const isAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATE.includes(k),
    );
    if (!isAllowed) {
      throw new Error('update not allowed!!');
    }
    if (data?.skills.length > 10) {
      throw new Error('cannot add more than 10 skills');
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: 'after',
      runValidators: true,
    });
    res.send('user updated successfully');
  } catch (err) {
    res.status(400).send('Something went wrong!' + err.message);
  }
});

connectDB()
  .then(() => {
    console.log('database connected successfully.');
    app.listen(7777, () => {
      console.log('server is listing on port 7777...');
    });
  })
  .catch((err) => {
    console.log('cannot connect to database.', err);
  });
