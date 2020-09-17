//import models
const db = require("../models");
const Promise = require("bluebird");

const SME = db.Sme;
const User = db.User;
const SME_Banking = db.SmeBanking;
const CorporatesSme = db.Corporates_Sme;

// global error message
const msg = "Something went wrong . Please try again";

// Post company details
exports.create = async (req, res,err) => {
  //bankName, accountNumber, bankType, smeId
  const {
    companyName,
    companyRegNo,
    street,
    suburb,
    city,
    officeNo,
    vatNo,
    numberOfDirectors,
    userId /*, status , active*/,
    bankName,
    accountNumber,
    bankType,
    accountCode
    // corporateId,
    // vendorNo,
  } = req.body;

  // corporate data
  const data= req.body.corporates;
 

  if (req.body) {
    SME.create({
      companyName,
      companyRegNo,
      street,
      suburb,
      city,
      officeNo,
      vatNo,
      numberOfDirectors,
      userId,
    })
      .then(sme => {
        // Send created sme to client
        SME_Banking.create({
          bankName,
          accountNumber,
          bankType,
          smeId: sme.id,
          accountCode,
        })
          .then(() => {
             try {
               data.forEach(async (corp) => {
                 await CorporatesSme.create({
                   smeId: sme.id,
                   corporateId: corp.corporateId,
                   vendorNo: corp.vendorNo,
                 });
               });
               return res.status(201).json({
                 success: true,
                 id:sme.id,
                 message: `SME created successfully`,
               });
             } catch (error) {
              next(error);
             }
          })
          .catch((err) => {
            res.status(500).json({ error: true, message: err.message });
          });
      })
      .catch((err) => {
        res.status(500).json({ error: true, message: err.message });
      });
  } else {
    res.status(500).json({ success: false, message: msg });
  }
};

// Fetch all SME
exports.findAll = (req, res) => {
  SME.findAll()
    .then((smes) => {
      // Send all SME to Client
      if (smes) {
          res.json({success:true, smes});
      } else {
          res
            .status(200)
            .json({
              success: false,
              message: "Nothing match your request!!",
            });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: true, message: err.message });
    });
};

// Fetch all sme thats belongs to user id
exports.findAllByUserId = (req, res) => {
  let { id } = req.params;
  SME.findAll({
    attributes:['id','status'],
    where: {
      userId: id
    }
  })
    .then((user) => {
      // Send all Invoice to Client
      if (user.length > 0) {
        res.json({ success: true, user });
      } else {
        res.status(416).json({
          success: false,
          message: "Nothing match your request!!",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: true, message: msg });
    });
};

// Find SME by Id including all associate
exports.findByPk = (req, res) => {

  let { id } = req.params;

  SME.findByPk(id, {
    include: [
      {
        model: User,
        as: "user",
        attributes: { exclude: ["password", "verified"] },
      },
      "sme_banking",
      "corporate_sme",
      "invoice",
      "documents",
    ],
  })
    .then((sme) => {
      if (sme) {
        res.json({ success: true, sme });
      } else {
        res.status(416).json({ success: false, message: "Nothing match your request!" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: true, message: err.message });
    });
};

// Update a SME identified by the SMEId in the request
exports.update = (req, res) => {
  const { id } = req.params;
  const { companyName, companyRegNo, street, suburb, city, officeNo, vatNo,numberOfDirectors, status,
    active} = req.body;

  if(companyName || companyRegNo || street ||suburb ||  city ||officeNo ||vatNo ||numberOfDirectors ||status || active){

      SME.update({
        companyName,
        companyRegNo,
        street,
        suburb,
        city,
        officeNo,
        vatNo,
        numberOfDirectors,
        status,
        active,
      }, {
        where: {
          id: id
        }
      })
        .then(sme => res.status(201).json({
          success: true,
          message: 'SME has been updated.'
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

// If all SME document submitted change status to Doc_Submitted 
exports.allDocumentsSubmitted = (req, res) => {
    const { smeId } = req.params;

    if (smeId) {
      SME.update(
        {
          status: "Doc_Submitted",
        },
        {
          where: {
            id: smeId
          }
        }
      )
        .then((document) => {
          if (document[0] === 0)
            return res.json({
              error: true,
              message:
                "Failed to update sme status",
            });
          res.status(201).json({
            success: true,
            message: "All SME documents submitted.",
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: true,
            message: err.message,
          });
        });
    } else {
      return res.json({
        success: false,
        message: "smeId is missing!!",
      });
    }
};

// Admin approve sme documents
exports.approveDocumentsSubmitted = (req, res) => {
    const { smeId } = req.params;

    if (smeId) {
      SME.update(
        {
          status: "Doc_Approve",
        },
        {
          where: {
            id: smeId
          }
        }
      )
        .then((document) => {
          if (document[0] === 0)
            return res.json({
              error: true,
              message:
                "Failed to approve sme documents.",
            });
          res.status(201).json({
            success: true,
            message: "SME documents approved.",
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: true,
            message: err.message,
          });
        });
    } else {
      return res.json({
        success: false,
        message: "smeId is missing!!",
      });
    }
};

// Find all sme by status
exports.findAllSMEByStatus = (req, res) => {
  let { status} = req.params;
  SME.findAll({
    // include: ["sme", "corporate"],
    where: {
      status
    },
  })
    .then((smes) => {
      // Send all Invoice to Client
      if (smes) {
        res.json({ success: true, smes });
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

// Delete SME by Id
exports.delete = (req, res) => {
  const { id } = req.params;
  SME.destroy({
      where: { id},
  })
    .then(() => {
        res.status(200).json({success: true, message:"SME has been deleted!"});
    })
    .catch((err) => {
        res.status(500).json({ error: true, message: "Fail to delete!" });
    });
};
