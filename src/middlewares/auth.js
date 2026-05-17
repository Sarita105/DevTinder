const User = require('../models/user');
const jwt = require('jsonwebtoken');

const authUserMiddleware = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      res.status(401).send("Login again")
    }
    const { _id } = await jwt.verify(token, 'Dev@Tinder.777');
    const user = await User.findById(_id);
    if (!user) {
      throw new Error('please login again!!');
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send('Error logging in:' + err.message);
  }
};
module.exports = {
  authUserMiddleware,
};
