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

  if(username.length > 20){
    return res.status(401).send({ error: "Your username is too long" }); // a finir;
  }

  let uWithMail = await User.findOne({ email })
  if(uWithMail){
    return res.status(401).send({ error: "email already used" }); // a finir;
  }

  let uWithUsername = await User.findOne({ username })
    if(uWithUsername){
      return res.status(401).send({ error: "username already used" }); // a finir;
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
  const url = `${process.env.HEROKULINK}/api/auth/verify/${verificationToken}`;

    await transporter.sendMail({
      to: req.body.email,
      subject: "Verify Sphinx Account",
      html: `
      <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
        <!--[if gte mso 9]>
        <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="x-apple-disable-message-reformatting">
          <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
          <title></title>
          
            <style type="text/css">
              @media only screen and (min-width: 520px) {
          .u-row {
            width: 500px !important;
          }
          .u-row .u-col {
            vertical-align: top;
          }

          .u-row .u-col-100 {
            width: 500px !important;
          }

        }

        @media (max-width: 520px) {
          .u-row-container {
            max-width: 100% !important;
            padding-left: 0px !important;
            padding-right: 0px !important;
          }
          .u-row .u-col {
            min-width: 320px !important;
            max-width: 100% !important;
            display: block !important;
          }
          .u-row {
            width: calc(100% - 40px) !important;
          }
          .u-col {
            width: 100% !important;
          }
          .u-col > div {
            margin: 0 auto;
          }
          }
        body {
          margin: 0;
          padding: 0;
        }

        table,
        tr,
        td {
          vertical-align: top;
          border-collapse: collapse;
        }

        p {
          margin: 0;
        }

        .ie-container table,
        .mso-container table {
          table-layout: fixed;
        }

        * {
          line-height: inherit;
        }

        a[x-apple-data-detectors='true'] {
          color: inherit !important;
          text-decoration: none !important;
        }

        table, td { color: #000000; } a { color: #0000ee; text-decoration: underline; }    </style>
          
          

        </head>

        <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #e7e7e7;color: #000000">
          <!--[if IE]><div class="ie-container"><![endif]-->
          <!--[if mso]><div class="mso-container"><![endif]-->
          <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #e7e7e7;width:100%" cellpadding="0" cellspacing="0">
          <tbody>
          <tr style="vertical-align: top">
            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #e7e7e7;"><![endif]-->
            

        <div class="u-row-container" style="padding: 0px;background-color: transparent">
          <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
            <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
              
        <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
        <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
          <div style="width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
          <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
          
        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                
          <h1 style="margin: 0px; line-height: 140%; text-align: center; word-wrap: break-word; font-weight: normal; font-family: book antiqua,palatino; font-size: 22px;">
            <strong>👋 Welcome ! <br /></strong>
          </h1>

              </td>
            </tr>
          </tbody>
        </table>

          <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
          </div>
        </div>
        <!--[if (mso)|(IE)]></td><![endif]-->
              <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
            </div>
          </div>
        </div>



        <div class="u-row-container" style="padding: 0px;background-color: transparent">
          <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
            <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
              
        <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
        <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
          <div style="width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
          <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
          
        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

        <div align="center">  
          <img src = "https://images.unlayer.com/projects/0/1647682391403-apple-splash-2778-1284.jpg" width="50%" />
        </div>
          <style>
          img{
            border-radius: 20px
          }
          .container{
            display: flex;
            justify-content: center
          }
        </style>
          </div>

              </td>
            </tr>
          </tbody>
        </table>

          <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
          </div>
        </div>
        <!--[if (mso)|(IE)]></td><![endif]-->
              <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
            </div>
          </div>
        </div>



        <div class="u-row-container" style="padding: 0px;background-color: transparent">
          <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
            <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
              
        <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
        <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
          <div style="width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
          <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
          
        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                
          <div style="line-height: 140%; text-align: left; word-wrap: break-word;">
            <p style="font-size: 14px; line-height: 140%; text-align: center;">🎉 Thank you for making an account on sphinxquiz.fr &nbsp;🎉</p>
        <p style="font-size: 14px; line-height: 140%; text-align: center;">&nbsp;</p>
        <p style="font-size: 14px; line-height: 140%; text-align: center;">Click on the button bellow to verify your account </p>
        <p style="font-size: 14px; line-height: 140%; text-align: center;">&nbsp;</p>
        <p style="font-size: 14px; line-height: 140%; text-align: center;">⬇️</p>
          </div>

              </td>
            </tr>
          </tbody>
        </table>

        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                
          <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;font-family:arial,helvetica,sans-serif;"><tr><td style="font-family:arial,helvetica,sans-serif;" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:36px; v-text-anchor:middle; width:75px;" arcsize="11%" stroke="f" fillcolor="#bb27e7"><w:anchorlock/><center style="color:#FFFFFF;font-family:arial,helvetica,sans-serif;"><![endif]-->
          <div align="center">  
          <a href="${url}" target="_blank" style="box-sizing: border-box;display: inline-block;font-family:arial,helvetica,sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #bb27e7; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;">
              <span style="display:block;padding:10px 20px;line-height:120%;"><span style="font-size: 14px; line-height: 16.8px;">Verify</span></span>
            </a>
          </div>

          <!--[if mso]></center></v:roundrect></td></tr></table><![endif]-->

              </td>
            </tr>
          </tbody>
        </table>

          <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
          </div>
        </div>
        <!--[if (mso)|(IE)]></td><![endif]-->
              <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
            </div>
          </div>
        </div>


            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
            </td>
          </tr>
          </tbody>
          </table>
          <!--[if mso]></div><![endif]-->
          <!--[if IE]></div><![endif]-->
        </body>

        </html>
      
      `,
    });

  } catch (error) {
    return res.status(500).send({ error: "Impossible d'envoyer un email a cette addresse" });
  }
  try{
    user.save();

  } catch (error) {
    return res.status(500).send({ error: error });
  }

  res.status(201).send({ message: `Sent a verification email to ${email} \n(Check the spams if you don't see it)` });
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  let user;
  try{
    user = await User.findOne({ username })
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
            username,
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
    console.log(error)
    return res.status(500).send(error);
  }

  var myquery = { _id: payload.ID };

  try {
    let u = await User.findByIdAndUpdate(myquery, {verified: true}, {upsert: true})
    console.log("test")
      return res.status(200).redirect("https://sphinxquiz.fr/index.php");

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

  let u = await (User.find({verified: true}).sort({score: -1}).limit(100).select("-_id username score goodAnswer badAnswer maxStreak currentStreak"))

  try {
    return res.status(200).send(u);
  } catch (error) {
    return res.status(500).send({ error: error });
  }

}
