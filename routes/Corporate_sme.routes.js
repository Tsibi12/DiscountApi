const authJwt = require("../middlewares/authJwt");
const Corporate_Sme = require("../controllers/Corporate_Sme.controller");


module.exports = (app) => {
  
  // Create a new Corporate_Sme
  app.post("/api/v1/corporate-sme", [authJwt.verifyToken, authJwt.isSmeOrAdmin], Corporate_Sme.create);

  // Retrieve all Corporate_Sme
  app.get("/api/v1/corporate-sme", [authJwt.verifyToken, authJwt.isSmeOrAdmin], Corporate_Sme.findAll);

  // Retrieve a single Corporate_Sme by Id
  app.get("/api/v1/corporate-sme/:id", [authJwt.verifyToken, authJwt.isSmeOrAdmin], Corporate_Sme.findByPk);

   // Retrieve a  Corporate_Sme by Scheme Id
   app.get("/api/v1/corporate-sme/sme/:smeId", [authJwt.verifyToken, authJwt.isSmeOrAdmin], Corporate_Sme.findBySmeId);

  // Update a Corporate_Sme with Id
  app.put("/api/v1/corporate-sme/:id", [authJwt.verifyToken, authJwt.isSmeOrAdmin], Corporate_Sme.update);

  // Delete a Corporate_Sme with Id
  app.delete("/api/v1/corporate-sme/:id", [authJwt.verifyToken, authJwt.isAdmin], Corporate_Sme.deleteById);

  // Delete a Corporate_Sme with smeID,corporateId and vendorNo
  app.delete("/api/v1/corporate-sme", [authJwt.verifyToken, authJwt.isSmeOrAdmin], Corporate_Sme.delete);
};
