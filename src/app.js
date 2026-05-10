const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
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
  const user = new User(req.body);
  try {
    await user.save();
    res.send('user added successfully');
  } catch (err) {
    res.status(400).send('Error saving user data:' + err.message);
  }
});

app.patch('/user', async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: 'after',
      runValidators: true
    });
    res.send('user updated successfully');
  } catch (err) {
    res.status(400).send('Something went wrong!'+err.message);
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
