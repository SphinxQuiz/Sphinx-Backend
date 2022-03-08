const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
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
      user
        .save()
        .then()
        .catch((error) => res.status(400).json({ error }));
      const verificationToken = user.generateVerificationToken();
      const url = `http://localhost:3000/api/verify/${verificationToken}`;
      transporter
        .sendMail({
          to: email,
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
      res.status(500).send({ error });
    });
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
          return res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, SPHINX_TOKEN_KEY, {
              expiresIn: "24h",
            }),
          });
        })

        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.verify = async (req, res, next) => {
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
    const user = await User.findOne({ _id: payload.ID }).exec();
    if (!user) {
      return res.status(404).send({ message: "User does not exist" });
    }

    user.verified = true;

    await user.save();

    return res.status(200).send({ message: "Account verified" });
  } catch (error) {
    return res.status(500).send(error);
  }
};
