const authJwt = require("../middlewares/authJwt");
const SME_Summary = require("../controllers/Sme_Summary_View.controller");
const Corporate_Summary = require("../controllers/Corporate_Summary_View.controller");

module.exports = (app) => {
    
    /******************************CORPORATE********************************* */
    
    app.get(
      "/api/v1/corporate-summary",
      [authJwt.verifyToken, authJwt.isAdmin], Corporate_Summary.getCorporateSummary
    );

    /******************************SME********************************* */
    
    app.get(
      "/api/v1/sme-summary",
      [authJwt.verifyToken, authJwt.isAdmin], SME_Summary.getSMESummary
    );
}
 