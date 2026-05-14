const express = require('express');
const { authUserMiddleware } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const requestRouter = express.Router();

requestRouter.post(
  '/request/send/:status/:toUserId',
  authUserMiddleware,
  async (req, res) => {
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

requestRouter.post(
  '/request/review/:status/:requestId',
  authUserMiddleware,
  async (req, res) => {
    try {
      const loggedinUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ['rejected', 'accepted'];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: 'invalid request status',
        });
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedinUser,
        status: 'interested',
      });
      if (!connectionRequest) {
        res.status(404).json({
          message: 'not a valid connection request',
        });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message: 'Connection request' + status,
        data,
      });
    } catch (err) {
      res.status(400).send('ERR:' + err.message);
    }
  },
);
module.exports = requestRouter;
