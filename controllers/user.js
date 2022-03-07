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
        return res.status(401); // a finir;
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
