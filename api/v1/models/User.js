const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  cognitoId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  dob: {
    type: String,
  },
  timestamp: {
    type: Number,
  },
  gender: {
    type: String,
  },
  createdAt: {
    type: String,
  },
  updatedAt: {
    type: String,
  },
});

const User = model('users', UserSchema);
module.exports = User;
