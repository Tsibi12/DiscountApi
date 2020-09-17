//import models
const db = require("../models");

const Sme_Summary_Views = db.Sme_Summary_Views;

// global error message
const msg = "Something went wrong . Please try again";

// Post company bank details

// Fetch all corporate
exports.getSMESummary = (req, res) => {
  Sme_Summary_Views.findAll()
    .then((sme) => {
      // Send all SME_Banking to Client
      if (sme) {
        res.json({ success: true, sme });
      } else {
        res.status(200).json({
          success: false,
          message: "Nothing match your request!!",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: true, message: err.message });
    });
};
