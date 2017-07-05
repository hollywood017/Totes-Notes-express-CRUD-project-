const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;
const myUserSchema = new Schema(
  {
    firstname: { type: String },
    lastname: { type: String},
    email: { type: String },
    encryptedPassword: { type: String },
  },
  {
    timestamps: true
  }
);

const UserModel = mongoose.model("User", myUserSchema);

module.exports = UserModel;
