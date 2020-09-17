//import models
const db = require("../models");

const Corporate_Summary_Views = db.Corporate_Summary_Views;

// global error message
const msg = "Something went wrong . Please try again";

// Post company bank details

// Fetch all corporate
exports.getCorporateSummary = (req, res) => {
  Corporate_Summary_Views.findAll()
    .then((summary) => {
      // Send all SME_Banking to Client
      if (summary) {
        res.json({ success: true, summary });
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
