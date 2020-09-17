const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require("../models");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const  _ = require("lodash");
const crypto = require("crypto");
// const dateFormat = require("dateformat");
const moment = require("moment");
require("dotenv").config();

// Backend URL
const URL = '';

// Frontend URL
const frontedURL = '';

//Creating instance of a model
const User = db.User;
const Role = db.Role;
const Corporate = db.Corporate;

// Or operator
const Op = db.Sequelize.Op;

 // SendGrid adding api key
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.API_KEY,
    },
  })
);

// Global error
const msg = 'Something went wrong. Please try again!!!';

//Date function => Adding 2 hours to the current date
Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
}

// Register user
exports.register = (req, res) => {
  const { email, firstName, lastName, contactNumber, designation, username, password, roles} = req.body;

  // Checking if user already exist 
  User.findOne({
    where: {
      username,
    },
  })
    .then((user) => {
        // if user does not exist create new one
      if (!user) {
        User.create({
          email,
          firstName,
          lastName,
          contactNumber,
          designation,
          username,
          password: bcrypt.hashSync(password, 12),
          roles,
        })
          .then((user) => {
            if (roles) {
              Role.findAll({
                where: {
                  name: {
                    [Op.or]: roles
                  }
                }
              }).then(roles => {
                user.setRoles(roles).then(() => {
                  res.status(201).json({
                    success: true,
                    message: "User created successfully. Please check your email"
                  });
                });
              });
            } else {
              // user role = 1
              user.setRoles([1]).then(() => {
                res.status(201).json({
                  success: true,
                  message: "User created successfully. Please check your email"
                });
              });
            }

            /**
             * Sending email confirmation
             */
              // async email
            jwt.sign(
              {
                user: _.pick(user, "id"),
              },
              process.env.EMAIL_TOKEN,
              {
                expiresIn: "1d",
              },
              (err, emailToken) => {
                const url = `${URL}/confirmation/${emailToken}`;

                transporter.sendMail({
                  to: req.body.username,
                  from: process.env.SEND_GRId_EMAIL,
                  subject: "Confirm Email",
                  html: `
                    Hi ${req.body.firstName}
                    <br/><br/>

                    Please click the following link to confirm your email: <a href="${url}">${url}</a>
                    
                    <br/><br/>
                    Regards

                    <br/><br/>
                    <hr/>
                    Dev Team`,
                });
              }
            );
          })
          .catch((err) => {
            res.status(500).send({ error: true, message: err.message });
          });
      } else {
          return res.status(404).send({ success:false, message: "User already exist." });
      }
      
    })
    .catch((err) => {
      res.status(500).send({ error: true, message: err.message });
    });
};

exports.login = (req, res) => {
  const { username } = req.body;

    User.findOne({
    where: {
        username
    },
    })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ success:false, message: "User Not found." });
      }

      if (!user.verified) {
        return res.status(404).send({ success: false, message: "please verify your email. If you don't see the email. check your spam box/junk and move email to inbox" });
      }

      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      
      if (!passwordIsValid) {
      return res.status(401).send({
          accessToken: null,
          message: "Username or Password is invalid!",
      });
      }

      var token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '24h' //86400, // 24 hours
      });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        //Update signedInAt
        User.update({
          lastSignedInAt: new Date().addHours(2)  // update signedInAt
        },
          {
            where: {
              username
            }
          })
          .then(() => {
            res.status(200).send({
              id: user.id,
              fullName: user.firstName + " " + user.lastName,
              username: user.username,
              roles: authorities,
              accessToken: token
            });
          }).catch(err => {
            res.status(500).send({ error: true, message: err.message });
          });
      });
    })
    .catch((err) => {
      res.status(500).send({ error: true, message: err.message });
    });
};

// Auth corporate 
exports.auth = (req, res) => {

  const {username} = req.body;
  // Checking if username is not empty
  if(!username)
    return res.send({ success: false, message: "Username is required." });

  Corporate.findOne({
    where: {
      username
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ success: false, message: "User Not found." });
      }

      // if (!user.verified) {
      //   return res.status(404).send({ success: false, message: "please verify your email. If you don't see the email. check your spam box/junk and move email to inbox" });
      // }

      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

      if (!passwordIsValid) {
        return res.status(401).send({
          token: null,
          message: "Username or Password is invalid!",
        });
      }

      var token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: 86400, //86400, // 24 hours
      });

      res.status(200).send({
        token: token,
        created: moment(new Date()).format("YYYYMMDDHHmm"), //  dateFormat(new Date(), "yyyy-mm-dd HHmm"),
        expires: moment(new Date()).format("YYYYMMDDHHmm") + 86400, //dateFormat(new Date(), "yyyy-mm-dd HHmm") + 86400,
      });

      // var authorities = [];
      // user.getRoles().then(roles => {
      //   for (let i = 0; i < roles.length; i++) {
      //     authorities.push("ROLE_" + roles[i].name.toUpperCase());
      //   }

        //Update signedInAt
      // Corporate.update({
      //     lastSignedInAt: new Date().addHours(2)  // update signedInAt
      //   },
      //     {
      //       where: {
      //         username
      //       }
      //     })
      //     .then(() => {
      //       res.status(200).send({
      //         token: token,
      //         created: moment(new Date()).format("YYYYMMDDHHmm"), //  dateFormat(new Date(), "yyyy-mm-dd HHmm"),
      //         expires: moment(new Date()).format("YYYYMMDDHHmm") + 86400, //dateFormat(new Date(), "yyyy-mm-dd HHmm") + 86400,
      //       });
      //     }).catch(err => { 
      //       res.status(500).send({ error: true, message: err.message });
      //     });
    //   });
    // })
    // .catch(err => {
    //   res.status(500).send({ error: true, message: err.message });
    });
};

// Fetch all user
exports.findAll = (req, res) => {
  User.findAll({ attributes: { exclude: ["password", "verified", "resetPasswordToken","resetPasswordExpires"] } })
    .then((user) => {
      // Send all user to Client
      if (user) {
        res.json({ success: true, user });
      } else {
        res.status(200).json({
          success: false,
          message: "Nothing match your request!!",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: true, message: msg });
    });
};

// Update a user identified by the userId in the request
exports.update = (req, res) => {
  //const {id } = req.params;
  const { id, email, firstName, lastName, username, contactNumber,designation} = req.body;
  
  User.update({
    email, 
    firstName, 
    lastName, 
    username,
    contactNumber, 
    designation
    // userType: userType
  }, {
    where: {
      id
    }
  })
    .then(user => res.status(201).json({
      success:true,
      message: 'User has been updated.'
    }))
    .catch(error => res.json({
      error: true,
      message: msg
    }));
};

// Forgot password link 
exports.forgotPassword = (req, res) => {
  const { username } = req.body;

  // Checking if email is not empty
  if (!req.body.username){
    return res.status(400).json(
    { success:false, message: 'Username is required!!' }
    );
  }

  // Checking if user exist in the database
  User.findOne({
    where: {
      username,
    },
  })
  .then( user => {
    if(!user) {
      return res.status(403).json(
     { success:false, message: 'User not found.' }
    )
    } 

    // generating email token and update database
    const token = crypto.randomBytes(20).toString('hex');
    User.update({ 
      resetPasswordToken:token,
      resetPasswordExpires: Date.now() + 3600000 // expire in 1 hour
    },
    {
      where: {
        username
      }
    })
    .then( () => {
      // Sending email to user
      transporter.sendMail({
        to: req.body.username,
        from: process.env.SEND_GRId_EMAIL,//"tsibiso.masiteng@rikatec.co.za",
        subject: "Link To Password Reset",
        html: `
          Hi 
          <br/><br/>

          You are receiving this because you (or someone else) have requested to reset 
          password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it: \n\n
          ${frontedURL}/reset-password/${token}\n\n
          If you did not request this, please ignore this email  and your password will remain unchanged.
          
          <br/><br/>
          Regards

          <hr/>
          System Admin`,
      });

      return res.status(200).json(
        { success:true, message: 'Recovery email sent.' }
      );
    })
    .catch(error => res.json({
      error: true,
      message: msg
    }));
  })
  .catch(error => res.json({
    error: true,
    message: msg
  }));
}

// Reset password link to frontend decoding token 
exports.resetPassword = (req, res) => {
  
  // Checking if email token is valid
  User.findOne({
    where: {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: {
        [Op.gt]: Date.now(),
        
      },
    },
  }).then( user => {
    if(!user) {
      return res.json(
      { success:false, message: 'Password reset link is invalid or has expired.'}
      )
    }

    res.json(
    { success:true,message:'Password reset link ok', user }
   )
  })
  .catch(error => res.json({
    error: true,
    message: error.message
  }));
}

// Find user by Id 
exports.findByPk = (req, res) => {

  let { id } = req.params;

  User.findByPk(id, { attributes: { exclude: ["password", "resetPasswordToken", "resetPasswordExpires"] }, include: ['sme'] })
    .then((user) => {
      if (user) {
        res.json({ success: true, user });
      } else {
        res.json({ success: false, message: "Nothing match your request!" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: true, message: msg });
    });
};

// Updating password
exports.updatePassword = (req, res) => {
  const { username, password } = req.body;

  // Checking if email exist
  User.findOne({
    where: { username }
  }).then( user => {
    if(!user) {
      return res.json(
      { success:false, message: 'User not found.' }
      );
    }

    // Update user password
    User.update({ 
      password: bcrypt.hashSync(password, 12),
      resetPasswordToken: null,
      resetPasswordExpires: null
    },
    {
      where: {
        username
      }
    })
    .then( () => res.json({success:true, message: 'User password updated successfully.'}))
    .catch(error => res.json({
      error: true,
      message: msg
    }));
    
  })
  .catch(error => res.json({
    error: true,
    message: msg
  }));
}

