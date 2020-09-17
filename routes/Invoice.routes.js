const authJwt = require("../middlewares/authJwt");
const Invoice = require("../controllers/Invoice_Received.controller");

module.exports = (app) => {
  
  // Create a new Invoice
  app.post("/api/v1/invoice",  Invoice.create);

  // Retrieve all Invoice
  app.get("/api/v1/invoice", [authJwt.verifyToken, authJwt.isAdmin], Invoice.findAll);

  // Retrieve all belonging to sme id
  app.get("/api/v1/sme-invoice/:id", [authJwt.verifyToken, authJwt.isSmeOrAdmin], Invoice.findAllBySmeId); 

  // Get discounted invoices
  app.get("/api/v1/discount-invoice/:smeId", [authJwt.verifyToken, authJwt.isSmeOrAdmin], Invoice.getDiscountInvoice); 

  // Retrieve all belonging to sme id
  app.get("/api/v1/invoice-status/:status", [authJwt.verifyToken, authJwt.isSmeOrAdmin], Invoice.findAllByStatus); 

  // Retrieve all invoice by status by signed in sme
  app.get("/api/v1/invoice-status-sme/:status/:smeId", [authJwt.verifyToken, authJwt.isSmeOrAdmin], Invoice.findAllStatusBySignedSME); 

  // Retrieve a single Invoice by Id
  app.get("/api/v1/invoice/:id", [authJwt.verifyToken, authJwt.isSmeOrAdmin], Invoice.findByPk);

  // Corporate: get all requested invoices
  app.get("/api/v1/corporate-in/:corporateId", [authJwt.verifyToken], Invoice.getAllRequestedInvoicesFromSME);

  // Retrieve all confirmed invoices
  app.get("/api/v1/confirmed-invoice", [authJwt.verifyToken, authJwt.isSmeOrAdmin], Invoice.confirmedInvoiceFromCorporate);

  // Update a Invoice with Id
  app.put("/api/v1/invoice/:id", [authJwt.verifyToken, authJwt.isSmeOrAdmin], Invoice.update);

  // Update  Multiple Invoice 
  app.put("/api/v1/discount-invoice", [authJwt.verifyToken, authJwt.isSmeOrAdmin], Invoice.updateMultipleInvoice); 

  // corporate confirm invoice -> change status to confirmed
  app.put("/api/v1/confirm-discount", [authJwt.verifyToken], Invoice.confirmInvoiceRequest); 

  // Admin paidOut invoice status
  app.put("/api/v1/paid-invoice", [authJwt.verifyToken, authJwt.isAdmin], Invoice.approveInvoiceRequest); 

  // Delete a Invoice with Id
  app.delete("/api/v1/invoice/:id", [authJwt.verifyToken, authJwt.isAdmin], Invoice.delete);

};
