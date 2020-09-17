//import models
const db = require("../models");
const uploadFileToBlob = require("../config/azure_blob");

const SME_Banking = db.SmeBanking;

// global error message
const msg = "Something went wrong . Please try again";

// Post company bank details
exports.create = (req, res) => {
  const { bankName, accountNumber, bankType, accountCode, smeId} = req.body;
  // Save data to  database

  if (req.body) {
    SME_Banking.create({
      bankName, accountNumber, bankType, smeId, accountCode
    })
      .then((banking) => {
        res
          .status(201)
          .json({
            success: true,
            message: "SME_Banking created successfully",
            banking,
          });
      })
      .catch((err) => {
        res.status(500).json({ error: true, message: err.message });
      });
  } else {
    res.status(500).json({ success: false, message: msg });
  }
};

// Fetch all SME_Banking
exports.findAll = (req, res) => {
  SME_Banking.findAll()
    .then((banks) => {
      // Send all SME_Banking to Client
      if (banks) {
        res.json({ success: true, banks });
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

// Find a SME_Banking by Id
exports.findByPk = (req, res) => {
    
    let { id } = req.params;

    SME_Banking.findByPk(id, { include: ['sme'] })
        .then((bank) => {
        if (bank) {
            res.json({ success: true, bank });
        } else {
            res.json({ success: false, message: "Nothing match your request! " });
        }
        })
        .catch((err) => {
          res.status(500).json({ error: true, message: msg });
        });
};

// Update a SME_Banking identified by the SME_BankingId in the request
exports.update = (req, res) => {
  const { id } = req.params;
  const { bankName, accountNumber, bankType, accountCode } = req.body;

  if (bankName || accountNumber || bankType || accountCode){
    SME_Banking.update({
      bankName,
      accountNumber,
      bankType,
      accountCode
    }, {
      where: {
        id: id
      }
    })
      .then(() => res.status(201).json({
        success: true,
        message: 'SME_Banking has been updated.'
      }))
      .catch(err => {
        res.status(500).json({
          error: true,
          message: msg
        });
      });

  } else {
    return res.json({
      success: false,
      message: 'You cannot update empty fields'
    });
  }
};

// Delete SME_Banking by Id
exports.delete = (req, res) => {
  const { id } = req.params;
  SME_Banking.destroy({
    where: { id: id },
  })
    .then(() => {
      res.status(200).json({ success: true, message: "SME_Banking has been deleted!" });
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: "Fail to delete banking details!" });
    });
};
