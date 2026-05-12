const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: 'String',
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: 'String',
      minLength: 4,
      maxLength: 50,
    },
    emailId: {
      type: 'String',
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('not a valid email!!!');
        }
      },
    },
    password: {
      type: 'String',
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error('Enter a strong password');
        }
      },
    },
    age: {
      type: 'Number',
      min: 18,
    },
    gender: {
      type: 'String',
      validate(value) {
        if (!['male', 'female', 'others'].includes(value)) {
          throw new Error('not a valid gender!!!');
        }
      },
    },
    photoUrl: {
      type: 'String',
      default:
        'https://as2.ftcdn.net/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg',
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error('not a valid url!!!');
        }
      },
    },
    about: {
      type: 'String',
      default: 'this is a default about of user',
    },
    skills: {
      type: ['String'],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, 'Dev@Tinder.777', {
    expiresIn: '1d',
  });
};

userSchema.methods.validatePassword = async function (InputPassword) {
  const user = this;
  const isValidPassword = await bcrypt.compare(InputPassword, user.password);

  return isValidPassword;
};
const User = mongoose.model('user', userSchema);

module.exports = User;
