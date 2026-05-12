const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const cookieParser = require('cookie-parser');
const app = express();
//routers
const authRouter = require('./routes/auth');
const requestRouter = require('./routes/requests');
const profileRouter = require('./routes/profile');

app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', requestRouter);
app.use('/', profileRouter);

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
