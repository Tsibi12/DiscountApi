const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
require("dotenv").config();
const db = require("./models");

const multer = require("multer");
const inMemoryStorage = multer.memoryStorage();
const singleFileUpload = multer({ storage: inMemoryStorage });

const app = express();

const URL = 'https://neuron-brigate.azurewebsites.net/api/v1';
// Use Helmet to protect against well known vulnerabilities
app.use(helmet());
// compress download resources
app.use(compression());
app.use(cors());
// app.disable("x-powered-by");
app.use(singleFileUpload.single("file"));
// parse requests of content-type - application/json
app.use(bodyParser.json({ limit: 52428800 }));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false, limit: 52428800 }));


// Activating user
app.get('/confirmation/:emailToken', async (req, res) => {
  try {
    const {
      user: { id },
    } = jwt.verify(req.params.emailToken, process.env.EMAIL_TOKEN);

    // res.json(id);
   
    await db.User.update({ verified: true }, { where: { id } });
  } catch (e) {
    res.json("error"+ e.message);
  }

  //return res.redirect("http://localhost:3000/login");
  return res.redirect('https://lendority.web.app/login')
 
});


// welcome router
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Lendority API :)" });
});

// routes
require('./routes/auth.routes')(app);
require('./routes/Sme.routes')(app);
require("./routes/Sme_banking.routes")(app);
require("./routes/Corporate_sme.routes")(app);
require("./routes/Corporate.routes")(app);
require("./routes/Invoice.routes")(app);
require("./routes/Sme_document.routes")(app);
require("./routes/Corporate_Interest_Rate.routes")(app);
require("./routes/All_Views.routes")(app);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});


// set port, listen for requests
const PORT = process.env.PORT || 4000;

// Starting the server
db.sequelize.sync(/*{ force: true}*/).then(function () {
  app.listen(PORT, function () {
    console.log(
      "==> 🌎  Server is running on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

