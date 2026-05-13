const express = require('express');
const { authUserMiddleware } = require('../middlewares/auth');
const { validateUserData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const profileRouter = express.Router();

profileRouter.get('/profile/view', authUserMiddleware, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send('Error saving user data:' + err.message);
  }
});

profileRouter.patch('/profile/edit', authUserMiddleware, async (req, res) => {
  try {
    if (!validateUserData(req)) {
      throw new Error('invalid edit request!');
    }
    const loggedinUser = req.user;
    Object.keys(req.body).forEach(
      (field) => (loggedinUser[field] = req.body[field]),
    );

    await loggedinUser.save();
    res.send(`${loggedinUser.firstName} , you profile has been updated!`);
  } catch (err) {
    res.status(400).send('Error editing user data:' + err.message);
  }
});
profileRouter.patch('/profile/updatePassword',async (req, res) => {
  try{
    const { emailId, password } = req.body;
    
     const user = await User.findOne({ emailId });
    console.log("ms",user)
    if (!user) {
      throw new Error('Invalid credentials');
    }
     const isSamePassword = await user.validatePassword(password);
     if(isSamePassword){
      throw new Error('Can not use old password');

     }else{
      const hashedpassword = await bcrypt.hash(password, 10);
      user.password = hashedpassword;

      await user.save();
      res.send('password updated successfully');
     }
  } catch (err) {
    res.status(400).send('something went wrong:' + err.message);
  }
})

module.exports = profileRouter;
