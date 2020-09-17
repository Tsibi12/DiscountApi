const authJwt = require("../middlewares/authJwt");
const CorporateRate = require("../controllers/Corporates_Interest_Rates");


module.exports = (app) => {

    // Create a new Corporate_Sme
    app.post("/api/v1/corporate-interest-rate", [authJwt.verifyToken, authJwt.isSmeOrAdmin], CorporateRate.create);

    // Retrieve all Corporate_Sme
    app.get("/api/v1/corporate-interest-rate", [authJwt.verifyToken, authJwt.isSmeOrAdmin], CorporateRate.findAll);

    // Retrieve a single Corporate_Sme by Id
    app.get("/api/v1/corporate-interest-rate/:id", [authJwt.verifyToken, authJwt.isAdmin], CorporateRate.findByPk);

    // Update a Corporate_Sme with Id
    app.put("/api/v1/corporate-interest-rate/:id", [authJwt.verifyToken, authJwt.isSmeOrAdmin], CorporateRate.update);

    // Delete a Corporate_Sme with Id
    app.delete("/api/v1/corporate-interest-rate/:id", [authJwt.verifyToken, authJwt.isAdmin], CorporateRate.delete);
};
