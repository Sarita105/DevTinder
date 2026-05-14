const mongoose = require('mongoose');
const User = require("./user");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
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
connectionRequestSchema.pre('save',async function(next) {

  if (this.fromUserId.equals(this.toUserId)) {
    return next(new Error('You cannot send request to yourself'));
  }
});

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

const ConnectionRequestModel = mongoose.model(
  'connectionRequestSchema',
  connectionRequestSchema,
);

module.exports = ConnectionRequestModel;
