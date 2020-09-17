const authJwt = require("../middlewares/authJwt");
const SME_Banking = require("../controllers/Sme_banking.controller");

// const multer = require("multer");
// const inMemoryStorage = multer.memoryStorage();
// const singleFileUpload = multer({ storage: inMemoryStorage });

module.exports = (app) => {
  

  // Create a new SME_Banking
  app.post("/api/v1/sme-banking", [authJwt.verifyToken, authJwt.isSmeOrAdmin], SME_Banking.create);

  // Retrieve all SME_Banking
  app.get("/api/v1/sme-banking", [authJwt.verifyToken, authJwt.isSmeOrAdmin], SME_Banking.findAll);

  // Retrieve a single SME_BankingME by Id
  app.get("/api/v1/sme-banking/:id", [authJwt.verifyToken, authJwt.isSmeOrAdmin], SME_Banking.findByPk);

  // Update a SME_Banking with Id
  app.put("/api/v1/sme-banking/:id", [authJwt.verifyToken, authJwt.isSmeOrAdmin], SME_Banking.update);

  // Delete a SME_Banking with Id
  app.delete("/api/v1/sme-banking/:id", [authJwt.verifyToken, authJwt.isSmeOrAdmin], SME_Banking.delete);
};
