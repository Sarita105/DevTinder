const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ['ignored', 'accepted', 'rejected', 'interested'],
        message: `{VALUE} is incorrect status type`,
      },
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
connectionRequestSchema.pre('save', function () {
  const connectionRequest = this;

  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error(' You cannot send request to yourself');
  }
  next();
});

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

const ConnectionRequestModel = mongoose.model(
  'connectionRequestSchema',
  connectionRequestSchema,
);

module.exports = ConnectionRequestModel;
