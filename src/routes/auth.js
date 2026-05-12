const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { validateSignupData } = require('../utils/validation');

const authRouter = express.Router();

authRouter.post('/signUp', async (req, res) => {
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

authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await user.validatePassword(password);

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

authRouter.post('/logout', async (req, res) => {
  res.cookie('token', null,{
    expires: new Date(Date.now())
  });
  res.send();
})

module.exports = authRouter;
