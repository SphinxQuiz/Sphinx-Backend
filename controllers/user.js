const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.signup = (req, res, next) => {
  console.log(req.body);

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
      });
      user.save().catch((error) => res.status(400).send({ error }));

      const verificationToken = user.generateVerificationToken();
      const url = `http://localhost:3000/api/auth/verify/${verificationToken}`;
      console.log(process.env.EMAIL_USERNAME);

      console.log(process.env.EMAIL_PASSWORD);
      transporter
        .sendMail({
          to: req.body.email,
          subject: "Verify Sphinx Account",
          html: `Click <a href = '${url}'>here</a> to confirm your email.`,
        })
        .then(() =>
          res
            .status(201)
            .send({ message: `Sent a verification email to ${email}` })
        )
        .catch((error) => res.status(400).send({ error }));
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ error });
    });
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).send({ error: "This user does not exist" }); // a finir;
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          try {
            if (!valid) {
              return res.status(401).send({ error: "Incorrect password" });
            }
            if (!user.verified) {
              return res.status(403).send({ error: "Verify your account" });
            }
          } catch (error) {
            return res.status(500).send({ error: "Incorrect password" });
          }
          return res.status(200).send({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, SPHINX_TOKEN_KEY, {
              expiresIn: "24h",
            }),
          });
        })

        .catch((error) => res.status(500).send({ error }));
    })
    .catch((error) => res.status(500).send({ error }));
};

exports.verify = (req, res, next) => {
  const { token } = req.params;

  if (!token) {
    return res.status(422).send({ message: "Missing Token" });
  }

  let payload = null;
  try {
    payload = jwt.verify(token, process.env.SPHINX_TOKEN_KEY);
  } catch (error) {
    return res.status(500).send(error);
  }

  try {
    const user = User.findOne({ _id: payload.ID }).exec();
    if (!user) {
      return res.status(404).send({ message: "User does not exist" });
    }

    user.verified = true;

    user.save().then(res.status(200).send({ message: "Account verified" }));
  } catch (error) {
    return res.status(500).send(error);
  }
};
