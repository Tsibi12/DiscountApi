//import models
const bcrypt = require("bcryptjs");
const generator = require("generate-password");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport"); 
require("dotenv").config();

const db = require("../models");

const Corporate = db.Corporate;

// global error message
const msg = "Something went wrong. Please try again";

 // SendGrid adding api key
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.API_KEY,
    },
  })
);

const password = generator.generate({
  length: 10,
  numbers: true,
});

// Post corporate details
exports.create = (req, res) => {
  const { corporateName, margin, transactionFeerate, email, username} = req.body;
  // Save data to  database
  if (req.body && email === username ) {
    Corporate.create({
      corporateName,
      margin,
      transactionFeerate,
      // active
      email,
      username,
      password: bcrypt.hashSync(password, 12),
    })
      .then((corporate) => {
        // Send created Corporate to client

        // API link
        const URL = 'https://neuron-brigate.azurewebsites.net/api/v1/corporate-password';
        // Sending email
        transporter.sendMail({
          to: req.body.username,
          from: process.env.SEND_GRId_EMAIL,
          subject: "Lendority Auth Details",
          html: `
            Greetings!! 
            <br/><br/>

            Welcome to Lendority. Here are your auth details:
            <p>username: ${username}</p> 
            <p>temporal password: ${password}</p>
            <p>Link to change your password : ${URL}</p>
            
            <br/><br/>
            Regards

            <br/><br/>
            <hr/>
            System Admin`,
        });
        res.status(201).json({
          success: true,
          message: "Corporate created successfully.Please check your email for authentication details",
          corporate,
        });
      })
      .catch((err) => {
        res.status(500).json({ success: false, message: err.message });
      });
  } else {
    res.status(500).json({ success: false, message:'All fields are required, email and username must be the same' });
  }
};

// Fetch all Corporate
exports.findAll = (req, res) => {
  Corporate.findAll({ attributes: { exclude: ["password"] } })
    .then((corporates) => {
      // Send all Corporate to Client
      if (corporates) {
        res.json({ success: true, corporates });
      } else {
        res.status(200).json({
          success: false,
          message: "Nothing match your request!!",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: err.message });
    });
};

// Find Corporate by Id including all associate
exports.findByPk = (req, res) => {
  let { id } = req.params;

  Corporate.findByPk(id, {
    attributes: { exclude: ["password"]},
    include: ["invoice"],
  })
    .then((corporate) => {
      if (corporate) {
        res.json({ success: true, corporate });
      } else {
        res.json({ success: false, message: "Nothing match your request!" });
      }
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: msg });
    });
};

// Update a Corporate identified by the CorporateId in the request
exports.update = (req, res) => {
  const { id } = req.params;
  const { corporateName, margin, transactionFeerate, active, email, username } = req.body;

  if (corporateName || margin || transactionFeerate || active || email || username) {

    // Checking if email and username are the same
    if (email !== username) {
      return res.json({ success: false, message: "Email and username must be the same!" })
    }
    
    Corporate.update({
      corporateName, margin, transactionFeerate, active, username, email 
    }, {
      where: {
        id: id
      }
    })
      .then(() => res.status(201).json({
        success: true,
        message: 'Corporate has been updated.'
      }))
      .catch(error => res.json({
        error: true,
        message: error.message
      }));

  } else {
    return res.json({
      success: false,
      message: 'All fields are required!!'
    });
  }
};

// Updating password
exports.updatePassword = (req, res) => {
  const { username, password } = req.body;

  // Checking if email exist
  Corporate.findOne({
    where: { username }
  }).then(user => {
    if (!user) {
      return res.json(
        { success: false, message: 'User not found.' }
      );
    }

    // Update user password
    Corporate.update({
      password: bcrypt.hashSync(password, 12),
    },
      {
        where: {
          username
        }
      })
      .then(() => res.json({ success: true, message: 'User password updated successfully.' }))
      .catch(error => res.json({
        error: true,
        message: error.message
      }));

  })
    .catch(error => res.json({
      error: true,
      message: error.message
    }));
}

// Delete Corporate by Id
exports.delete = (req, res) => {
  //console.log("result :" + req.params.id);
  const { id } = req.params;
  Corporate.destroy({
    where: { id: id },
  })
    .then(() => {
      res
        .status(200)
        .json({
          success: true,
          message: "Corporate has been deleted!",
        });
    })
    .catch((err) => {
      res.status(500).json({ error: true, message: "Fail to delete!" });
    });
};
