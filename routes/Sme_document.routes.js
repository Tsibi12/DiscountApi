const SmeDocument = require("../controllers/Sme_document.controller");
const authJwt = require("../middlewares/authJwt");

module.exports = (app) => {

    // Create a new SmeDocument
    app.post(
      "/api/v1/sme-document",[authJwt.verifyToken, authJwt.isSmeOrAdmin], SmeDocument.createMultiple
    );

    // Retrieve all SmeDocument
    app.get("/api/v1/sme-document", [authJwt.verifyToken, authJwt.isSmeOrAdmin], SmeDocument.findAll);

    // Retrieve a single SmeDocument by Id
    app.get("/api/v1/sme-document/:id",[authJwt.verifyToken, authJwt.isSmeOrAdmin], SmeDocument.findByPk);

    // Update  SmeDocument with Id
    app.put("/api/v1/sme-document/:id",[authJwt.verifyToken, authJwt.isSmeOrAdmin], SmeDocument.update);

    // Confirm SmeDocument with Id and smeId
    app.put("/api/v1/sme-document",[authJwt.verifyToken, authJwt.isAdmin], SmeDocument.approveDocuments);

    // Delete  SmeDocument with Id
    app.delete("/api/v1/sme-document/:id",[authJwt.verifyToken, authJwt.isSmeOrAdmin], SmeDocument.delete);
};
