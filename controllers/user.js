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

exports.signup = async (req, res, next) => {
  const { email, username, password} = req.body;

  let user;

  let uWithMail = await User.findOne({ email })
  if(uWithMail){
    if (uWithMail) {
      return res.status(401).send({ error: "email already used" }); // a finir;
    }
  }

  let uWithUsername = await User.findOne({ username })
    if(uWithUsername){
      if (uWithUsername) {
        return res.status(401).send({ error: "username already used" }); // a finir;
      }
    }

  try {
    const hash = await bcrypt.hash(password, 10);
    user = new User({
      username,
      email,
      password: hash,
    });
  } catch (error) {
    return res.status(500).send({ error: "username already taken" });
    }

  try{
  const verificationToken = user.generateVerificationToken();
  const url = `${process.env.HEROKULINK}/api/auth/verify${verificationToken}`;

    await transporter.sendMail({
      to: req.body.email,
      subject: "Verify Sphinx Account",
      html: `Click <a href = '${url}'>here</a> to confirm your email.`,
    });

  } catch (error) {
    return res.status(500).send({ error: "Impossible d'envoyer un email a cette addresse" });
  }
  try{
    user.save();

  } catch (error) {
    return res.status(500).send({ error: error });
  }

  res.status(201).send({ message: `Sent a verification email to ${email}` });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  let user;
  try{
    user = await User.findOne({ email })
    if (!user) {
      return res.status(401).send({ error: "This user does not exist" }); // a finir;
    }
  } 
  catch (error) {
    return res.status(500).send({ error: error });
  }

  try{
    let b = bcrypt
        .compare(password, user.password)
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
          const token = jwt.sign(
            { userId: user._id },
            process.env.SPHINX_TOKEN_KEY,
            {
              expiresIn: "24h",
            }
          );
          return res.status(200).send({
            userId: user._id,
            token,
          });
        })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ error: error });
  }

};

exports.verify = async (req, res, next) => {
  let token = req.params.id;
  if (!token) {
    return res.status(422).send({ message: "Missing Token" });
  }

  let payload = null;
  try {
    payload = jwt.verify(token, process.env.SPHINX_TOKEN_KEY);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }

  try {
    const user = await User.findOne({ _id: payload.ID }).exec();

    if (!user) {
      return res.status(404).send({ message: "User does not exist" });
    }
  } catch (error) {
    return res.status(500).send(error);
  }

  var myquery = { _id: payload.ID };
  var newvalues = { verified: true };

  try {
    let u = await User.findByIdAndUpdate(myquery, {verified: true}, {upsert: true})
      return res.status(200).send({ message: "Account verified" });

  } 
  catch (error) {
    return res.status(500).send({ error: error });
  }
  
};

exports.getInfo = async (req, res, next) => {

  const { token } = req.body

  if (!token) {
    res.status(400).send({ error: "You must login" });
  }

  const decodedToken = jwt.verify(token, process.env.SPHINX_TOKEN_KEY);
  const userId = decodedToken.userId;

  let u = await User.find({_id: userId}).select("-_id username score goodAnswer badAnswer maxStreak currentStreak")



  try {
    return res.status(200).send(u);

  } catch (error) {
    return res.status(500).send({ error: error });
  }
}

exports.getLeaderboard = async (req, res, next) => {


  let u = await (User.find().sort({score: -1}).limit(100).select("-_id username score goodAnswer badAnswer maxStreak currentStreak"))

  try {
    return res.status(200).send(u);
  } catch (error) {
    return res.status(500).send({ error: error });
  }

}
