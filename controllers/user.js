const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { eq } = require("lodash");

exports.signup = (req, res, next) => {
  bcrypt
    .hash()
    .then((hash) => {
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
      })
        .save()
        .then(() => res.status(201).json({ message: "User created" }))
        .catch(res.status(400).json({ error }));
    })
    .catch((error) => req.status(400).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "This user does not exist" }); // a finir;
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Incorrect password" });
          }
          return res
            .status(200)
            .json({
              userId: user._id,
              token: jwt.sign({ userId: user._id }, "H6zT5kXx6Ffi6RI8rKSb", {
                expiresIn: "24h",
              }),
            });
        })

        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
