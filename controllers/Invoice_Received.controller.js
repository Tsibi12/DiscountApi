//import models
const db = require("../models");
const dateFormat = require("dateformat");

const Invoice = db.Invoices;
const sequelize = db.sequelize;
const Corporate = db.Corporate;
const SME = db.Sme;

// global error message
const msg = "Something went wrong. Please try again";

//  operator
const {Op} = db.Sequelize;

// Post Invoice details
exports.create = async (req, res) => {
  const { companyRegNo, corporateName, smeVendorNo, invoiceNumber, invoiceDate, invoicePaymentDate, invoiceAmount } = req.body;

  // Check if all field are not empty
  if (companyRegNo && corporateName && smeVendorNo && invoiceNumber && invoiceDate && invoicePaymentDate && invoiceAmount) {

    // Find corporate  id by corporateName
    Corporate.findOne({
      attributes:['id'],
      where: {
        corporateName,
      },
    })
      .then(corporate => {
        if(!corporate){
          return res.json({ success: false, message:"Corporate name does not exist. contact Lendority for any help"});
        } 
        // Find sme  id by companyRegNo
        SME.findOne({
          attributes: ['id'],
          where: {
            companyRegNo,
          },
        })
          .then(sme => {
            if (!sme) {
              return res.json({ success: false, message: "Company registration No. does not exist. contact Lendority for any help" });
            }
            // Saving invoice
            Invoice.create({
              corporateId:corporate.id,
              smeId:sme.id,
              smeVendorNo,
              invoiceNumber,
              invoiceDate,
              invoicePaymentDate,
              invoiceAmount,
            })
              .then((invoice) => {
                // Send created Invoice to client
                res.status(201).json({
                  success: true,
                  message: "Invoice created successfully",
                  invoice,
                });
              })
              .catch((err) => {
                res.status(500).json({ error: true, message: err.message });
              });
          }).catch(error => res.json({ error: true, message: error.message }));
      }).catch(error => res.status(500).json({ error: true, message: error.message }));
  } else {
    res.status(500).json({ success: false, message: "All field are required!!" });
  }
};

// Fetch all Invoice
exports.findAll = async(req, res) => {
  Invoice.findAll({
    include: ['sme','corporate'],
  })
    .then((invoices) => {
      // Send all Invoice to Client
      if (invoices) {
        res.json({ success: true, invoices });
      } else {
        res.status(200).json({
          success: false,
          message: "No invoices found!!!",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: true, message: msg });
    });
};

// Fetch all Invoice
exports.findAllByStatus = (req, res) => {
  let { status } = req.params;
  Invoice.findAll({
    include: ['sme', 'corporate'],
    where: {
      invoiceStatus: status
    }
  })
    .then((invoices) => {
      // Send all Invoice to Client
      if (invoices.length > 0) {
        res.json({ success: true, invoices });
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

// Fetch all Invoice By signedIn sme
exports.findAllStatusBySignedSME = (req, res) => {
  let { status, smeId } = req.params;
  Invoice.findAll({
    include: ['sme', 'corporate'],
    where: {
      invoiceStatus: status,
      smeId
    }
  })
    .then((invoices) => {
      // Send all Invoice to Client
      if (invoices.length > 0) {
        res.json({ success: true, invoices });
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

// Fetch all thats belongs to sme id
exports.findAllBySmeId = (req, res) => {
  let { id } = req.params;
  Invoice.findAll({
    include: ['sme', 'corporate'] ,
    where: {
      smeId: id
    }
  })
    .then((invoices) => {
      // Send all Invoice to Client
      if (invoices.length > 0) {
        res.json({ success: true, invoices });
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

// Get Discount invoice
exports.getDiscountInvoice = async (req, res) => {
  let { smeId } = req.params;

  // Calling Discount invoices store procedure
  await sequelize.query('Lendority_Discounting_SP :id', { replacements: { id: smeId }})
    .then(async(invoice) => {
      // if (result.length > 0) {
        Invoice.findAll({
          // attributes: { exclude: ["corporateName"] }, include: ['sme','corporate'] ,
          include: ['sme', 'corporate'],
          where: {
            invoiceStatus: "Available",
            smeId
          }
        })
          .then((discount) => {
            // Send all Invoice to Client
            if (discount.length > 0) {
              let groupedDiscount = [];
              let smeInvoices = [];
              let smeId = 0;
              let sme = undefined;

              for (let i = 0; i < discount.length; i++) {
                if (smeId !== discount[i].smeId) {
                  if (smeInvoices.length > 0) {
                    groupedDiscount.push({ smeId, sme, discounts: smeInvoices });
                  }
                  smeId = discount[i].smeId;
                  sme = discount[i].sme;

                  smeInvoices = [discount[i]];
                } else {
                  smeInvoices.push(discount[i]);
                }
              }

              if (smeInvoices.length > 0) {
                groupedDiscount.push({ smeId, sme, invoices: smeInvoices });
              }
              res.json({ success: true, groupedDiscount });
            } else {
              res.status(416).json({
                success: false,
                message: "Nothing match your request!!",
              });
            }
          })
          .catch((err) => {
            res.status(500).json({ error: true, message: err.message });
          });
    })
    .catch((err) => {
      res.status(500).json({ error: true, message: err.message });
    });
};

// Find Invoice by Id including all associate
exports.findByPk = (req, res) => {
  let { id } = req.params;

  Invoice.findByPk(id, {include: ['sme','corporate']})
    .then((invoice) => {
      if (invoice) {
        res.json({ success: true, invoice });
      } else {
        res.json({ success: false, message: "Nothing match your request!" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: true, message: msg });
    });
};


// Update a Invoice identified by the InvoiceId in the request
exports.update = (req, res) => {
  const { id } = req.params;
  const { smeVendorNo, invoiceNumber, invoiceDate, invoicePaymentDate, invoiceAmount, invoiceStatus } = req.body;

  if (smeVendorNo || invoiceNumber || invoiceDate || invoicePaymentDate || invoiceAmount || invoiceStatus){
    Invoice.update({
      smeVendorNo,
      invoiceNumber,
      invoiceDate,
      invoicePaymentDate,
      invoiceAmount,
      invoiceStatus
    }, {
      where: {
        id: id
      }
    })
      .then(invoice => res.status(201).json({
        success: true,
        message: 'Invoice has been updated.'
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

// Update multiple Invoices on requested discount -> change invoiceStatus to Requested
exports.updateMultipleInvoice = async (req, res) => {
  const { invoiceIds,smeId} = req.body;

  if (invoiceIds && smeId) {
  
    // Updating invoice status
    Invoice.update({
      invoiceStatus: "Requested",
      requestDate: Date.now()
    }, {
      where: {
        smeId,
        id: {
          [Op.in]: invoiceIds   // passing multiple invoice ids
        }     
      }
    })
      .then(async(invoice) => {
        if (invoice[0] === 0) return res.json({ error: true, message: "Failed to update invoice status. make sure invoiceIds are inside an array" });

        // Calling sme  summary store procedure
        await sequelize.query('Lendority_SmeSummaries_SP :id', { replacements: { id: smeId }})
          .then()
          .catch((err) => {
            res.status(500).json({ error: true, message: err.message });
          });

        // Calling corporate summary store procedure
        await sequelize.query('Lendority_CorporateSummaries_SP :id', { replacements: { id: smeId }})
          .then()
          .catch((err) => {
            res.status(500).json({ error: true, message: err.message });
          });
          
        res.status(201).json({
          success: true,
          message: 'Invoice has been Requested.'
        })
      })
      .catch(err => {
        res.status(500).json({
          error: true,
          message: msg
        });
      });

  } else {
    return res.json({
      success: false,
      message: 'Invoice Ids or smeId is missing'
    });
  }
};

// Corporate : get all requested invoice from sme
exports.getAllRequestedInvoicesFromSME = (req, res) => {
  const {corporateId} = req.params;

  Invoice.findAll({
    include: ['sme', 'corporate'],
    where: {
      corporateId,
      invoiceStatus: "Requested",
    },
  })
    .then((discount) => {
      // Send all Invoice to Client
      if (discount.length > 0) {
        let groupedDiscount = [];
        let smeInvoices = [];
        let smeId = 0;
        let sme = undefined;
        let smeTotalPayoutAmount = 0;

        for (let i = 0; i < discount.length; i++) {
          if (smeId !== discount[i].smeId) {
            if (smeInvoices.length > 0) {
              groupedDiscount.push({
                smeId,
                smeTotalPayoutAmount,
                sme,
                discounts: smeInvoices,
              });
            }
            smeId = discount[i].smeId;
            sme = discount[i].sme;
            smeTotalPayoutAmount = discount[i].payoutAmount;

            smeInvoices = [discount[i]];
          } else {
            smeInvoices.push(discount[i]);
            smeTotalPayoutAmount += discount[i].payoutAmount;
          }
        }

        if (smeInvoices.length > 0) {
          groupedDiscount.push({ smeId, smeTotalPayoutAmount, sme, invoices: smeInvoices });
        }
        res.json({ success: true, groupedDiscount });
      } else {
        res.status(500).json({
          success: false,
          message: "Nothing match your request!!",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: true, message: msg });
    });
};

// Corporate confirmed multiple Invoices on requested discount -> change invoiceStatus to confirmed
exports.confirmInvoiceRequest = async(req, res) => {
  const { invoiceIds } = req.body;

  if (invoiceIds) {
    Invoice.update({
      invoiceStatus: "Confirmed",
      confirmedDate: Date.now()
    }, {
      where: {
        id: {
          [Op.in]: invoiceIds   // passing multiple invoice ids
        }
      }
    })
      .then(async(invoice) => {
        if (invoice[0] === 0) return res.json({ error: true, message: "Failed to update invoice status. make sure invoiceIds are inside an array" });

        // Calling sme  summary store procedure
        // await sequelize.query('Lendority_SmeSummaries_SP :id', { replacements: { id: smeId }})
        //   .then()
        //   .catch((err) => {
        //     res.status(500).json({ error: true, message: err.message });
        //   });

        // Calling corporate summary store procedure
        // await sequelize.query('Lendority_CorporateSummaries_SP :id', { replacements: { id: smeId }})
        //   .then()
        //   .catch((err) => {
        //     res.status(500).json({ error: true, message: err.message });
        //   });

        res.status(201).json({
          success: true,
          message: 'Invoice has been confirmed.'
        })
      })
      .catch(err => {
        res.status(500).json({
          error: true,
          message: err.message
        });
      });

  } else {
    return res.json({
      success: false,
      message: 'InvoiceIds is missing!!'
    });
  }
};

// Get confirmed invoices from corporate
exports.confirmedInvoiceFromCorporate = (req, res) => {

    Invoice.findAll({
      include: ['sme','corporate'],
      where: {
        invoiceStatus: "Confirmed",
      },
    })
      .then((discount) => {
        
        // Send all Invoice to Client
        if (discount.length > 0) {
          let groupedDiscount = [];
          let smeInvoices = [];
          let smeId = 0;
          let sme = undefined;
          let smeTotalPayoutAmount = 0;

          for (let i = 0; i < discount.length; i++) {
            if (smeId !== discount[i].smeId) {
              if (smeInvoices.length > 0) {
                groupedDiscount.push({
                  smeId,
                  smeTotalPayoutAmount,
                  sme,
                  discounts: smeInvoices,
                });
              }
              smeId = discount[i].smeId;
              sme = discount[i].sme;
              smeTotalPayoutAmount = discount[i].payoutAmount;

              smeInvoices = [discount[i]];
            } else {
              smeInvoices.push(discount[i]);
              smeTotalPayoutAmount += discount[i].payoutAmount;
            }
          }

          if (smeInvoices.length > 0) {
            groupedDiscount.push({ smeId, smeTotalPayoutAmount,sme, invoices: smeInvoices });
          }
          res.json({ success: true, groupedDiscount });
        } else {
          res.status(500).json({
            success: false,
            message: "Nothing match your request!!",
          });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: true, message: err.message });
      });

};


// Admin Paid multiple Invoices on requested discount -> change invoiceStatus to PaidOut
exports.approveInvoiceRequest = async(req, res) => {
  const { invoiceIds } = req.body;

  if (invoiceIds) {
    Invoice.update({
      invoiceStatus: "PaidOut",
      paidDate: Date.now()
    }, {
      where: {
        id: {
          [Op.in]: invoiceIds   // passing multiple invoice ids
        }
      }
    })
      .then(async(invoice) => {
        if (invoice[0] === 0) return res.json({ error: true, message: "Failed to update invoice status. make sure invoiceIds are inside an array" });

        // Calling sme  summary store procedure
        // await sequelize.query('Lendority_SmeSummaries_SP :id', { replacements: { id: smeId }})
        //   .then()
        //   .catch((err) => {
        //     res.status(500).json({ error: true, message: err.message });
        //   });

        // Calling corporate summary store procedure
        // await sequelize.query('Lendority_CorporateSummaries_SP :id', { replacements: { id: smeId }})
        //   .then()
        //   .catch((err) => {
        //     res.status(500).json({ error: true, message: err.message });
        //   });

        res.status(201).json({
          success: true,
          message: 'Invoice has been paid out.'
        })
      })
      .catch(err => {
        res.status(500).json({
          error: true,
          message: err.message
        });
      });

  } else {
    return res.json({
      success: false,
      message: 'InvoiceIds is missing!!'
    });
  }
};

// Delete Invoice by Id
exports.delete = (req, res) => {
  //console.log("result :" + req.params.id);
  const { id } = req.params;
  Invoice.destroy({
    where: { id: id },
  })
    .then(() => {
      res.status(200).json({
        success: true,
        message: "Invoice has been deleted!",
      });
    })
    .catch((err) => {
      res.status(500).json({ error: true, message: "Fail to delete!" });
    });
};



