const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const { validateSignupData } = require('./utils/validation');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const { authUserMiddleware } = require('./middlewares/auth');
app.use(express.json());
app.use(cookieParser());

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
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword =await user.validatePassword(password);

    if (isValidPassword) {
      const token = await user.getJWT();
      res.cookie('token', token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send('login successful');
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (err) {
    res.status(400).send('Error saving user data:' + err.message);
  }
});

app.get('/profile', authUserMiddleware, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send('Error saving user data:' + err.message);
  }
});

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

app.post(
  '/sendConnectionRequest',
  authUserMiddleware,
  async (req, res, next) => {
    const user = req.user;
    res.send(user + 'has sent a request');
  },
);
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
