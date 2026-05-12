const express = require('express');
const { authUserMiddleware } = require('../middlewares/auth');
const { validateUserData } = require('../utils/validation');
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

module.exports = profileRouter;
