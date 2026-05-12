const express = require('express');
const { authUserMiddleware } = require('../middlewares/auth');

const requestRouter = express.Router();

requestRouter.post(
  '/sendConnectionRequest',
  authUserMiddleware,
  async (req, res, next) => {
    const user = req.user;
    res.send(user + 'has sent a request');
  },
);

module.exports = requestRouter;