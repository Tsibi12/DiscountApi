const authJwt  = require("../middlewares/authJwt");
const User = require("../controllers/auth.controller");

module.exports = app => {
  
    // Create a new SME
    app.post("/api/v1/register", User.register);

    // Login
    app.post("/api/v1/login", User.login);

    // Auth corporate
    app.post("/api/v1/auth", User.auth);

    // Retrieve all SME
    // app.get("/api/v1/user", [authJwt.verifyToken, authJwt.isSmeOrAdmin], User.findAll);
    app.get("/api/v1/user",[authJwt.verifyToken, authJwt.isSmeOrAdmin], User.findAll);

    // Forgot password
    app.post("/api/v1/forgot-password", User.forgotPassword);

    // Reset password
    app.get("/api/v1/reset-password/:token", User.resetPassword);

    // Update password
    app.put("/api/v1/update-password", User.updatePassword);

    // Update a SME with Id
    app.put("/api/v1/update-profile", [authJwt.verifyToken, authJwt.isSmeOrAdmin], User.update);

    // Get user by ID
    app.get("/api/v1/user/:id", [authJwt.verifyToken, authJwt.isSmeOrAdmin], User.findByPk);

    // // Delete a SME with Id
    // app.delete("/api/v1/sme/:id", SME.delete);
};
