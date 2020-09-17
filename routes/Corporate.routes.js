const Corporate = require("../controllers/Corporate.controller");
const authJwt = require("../middlewares/authJwt");

module.exports = (app) => {

  // Create a new Corporate
  app.post("/api/v1/corporate" , [authJwt.verifyToken, authJwt.isAdmin], Corporate.create);

  // Retrieve all Corporate
  app.get("/api/v1/corporate", [authJwt.verifyToken, authJwt.isSmeOrAdmin], Corporate.findAll);

  // Retrieve a single Corporate by Id
  app.get("/api/v1/corporate/:id", [authJwt.verifyToken, authJwt.isAdmin], Corporate.findByPk);

  // Update  Corporate where Id
  app.put("/api/v1/corporate/:id", [authJwt.verifyToken, authJwt.isAdmin], Corporate.update);

  // Update  Corporate password
  app.put("/api/v1/corporate-password", [authJwt.verifyToken], Corporate.updatePassword);

  // Delete a Corporate with Id
  app.delete("/api/v1/corporate/:id", [authJwt.verifyToken, authJwt.isAdmin], Corporate.delete);
};
