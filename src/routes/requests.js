const express = require('express');
const { authUserMiddleware } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const requestRouter = express.Router();

requestRouter.post(
  '/request/send/:status/:toUserId',
  authUserMiddleware,
  async (req, res, next) => {
    try {
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const fromUserId = req.user._id;

      const allowedStatus = ['ignored', 'interested'];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: 'invalid request status',
        });
      }
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({
          message: 'user not found',
        });
      }
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: 'connection request already existis' });
      }
      const connectionRequest = new ConnectionRequest({
        toUserId,
        fromUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: 'connection request sent successfully',
        data,
      });
    } catch (err) {
      res.status(400).send('ERR:' + err.message);
    }
  },
);

module.exports = requestRouter;
