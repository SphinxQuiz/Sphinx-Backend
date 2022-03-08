const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator);

userSchema.methods.generateVerificationToken = function () {
  const user = this;

  const verificationToken = jwt.sign(
    { ID: user._id },
    process.env.SPHINX_TOKEN_KEY,
    { expiresIn: "7d" }
  );
  return verificationToken;
};

module.exports = mongoose.model("User", userSchema);
