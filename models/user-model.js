const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;
const myUserSchema = new Schema(
  {
    fullname: { type: String },
    email: { type: String },
    encryptedPassword: { type: String }

    //googleId--------------------

    //facebookId------------------

  },
  {
    timestamps: true
  }
);

const UserModel = mongoose.model("User", myUserSchema);

module.exports = UserModel;
