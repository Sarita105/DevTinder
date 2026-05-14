const express = require('express');
const { authUserMiddleware } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const userRouter = express.Router();

const USER_SAFE_DATA = 'firstName lastName photoUrl age gender about skills';

userRouter.get(
  '/user/requests/received',
  authUserMiddleware,
  async (req, res) => {
    try {
      const loggedinUser = req.user;
      const findConnections = await ConnectionRequest.find({
        toUserId: loggedinUser._id,
        status: 'interested',
      }).populate('fromUserId', USER_SAFE_DATA);

      console.log(findConnections);
      res.json({
        message: 'all requests',
        connections: findConnections,
      });
    } catch (err) {
      res.status(400).send('ERR:' + err.message);
    }
  },
);

userRouter.get('/user/connections', authUserMiddleware, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: 'accepted' },
        { fromUserId: loggedInUser._id, status: 'accepted' },
      ],
    })
      .populate('fromUserId', USER_SAFE_DATA)
      .populate('toUserId', USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});
module.exports = userRouter;
