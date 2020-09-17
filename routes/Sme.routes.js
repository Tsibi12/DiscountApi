const authJwt = require("../middlewares/authJwt");
const SME = require("../controllers/Sme.controller");

module.exports = app => {
    

    // Create a new SME
    app.post("/api/v1/sme", [authJwt.verifyToken, authJwt.isSmeOrAdmin], SME.create);

    // Retrieve all SME
    app.get("/api/v1/sme", [authJwt.verifyToken, authJwt.isSmeOrAdmin], SME.findAll);

    // Retrieve a single SME by Id
    app.get("/api/v1/sme/:id", [authJwt.verifyToken, authJwt.isSmeOrAdmin], SME.findByPk);

    // Retrieve all sme belonging to user id
    app.get("/api/v1/user-sme/:id", [authJwt.verifyToken, authJwt.isSmeOrAdmin], SME.findAllByUserId);

    // Get all sme by status
    app.get("/api/v1/sme-document-status/:status", [authJwt.verifyToken, authJwt.isSmeOrAdmin], SME.findAllSMEByStatus);

    // Update a SME with Id
    app.put("/api/v1/sme/:id", [authJwt.verifyToken, authJwt.isSmeOrAdmin], SME.update);

    // Update sme status to Doc_Submitted when all documents are submitted
    app.put("/api/v1/sme-document-status/:smeId", [authJwt.verifyToken, authJwt.isSmeOrAdmin], SME.allDocumentsSubmitted);

    // Admin change sme status to Doc_Approve
    app.put("/api/v1/sme-document-approved/:smeId", [authJwt.verifyToken, authJwt.isSmeOrAdmin], SME.approveDocumentsSubmitted);

    // Delete a SME with Id
    app.delete("/api/v1/sme/:id", [authJwt.verifyToken, authJwt.isAdmin], SME.delete);
};
