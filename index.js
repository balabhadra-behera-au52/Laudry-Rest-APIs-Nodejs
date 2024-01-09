/**
 * Imported Libraries
 */
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const util = require("util");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");
const dotenv = require("dotenv");
const colors = require("colors");
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerDocument = require('./swagger.json')
/**
 * Configuration
 */
dotenv.config({ path: "./app/utils/config/config.env" });
require("./app/utils/config/database")();

/**
 * Server Configuration
 */
// init app
const app = express();
const options = {
 definition: swaggerDocument,
  apis: ['./app/routes*.js'], // files containing annotations as above
};
const swaggerDefinition = swaggerJSDoc(options);

// Serve the Swagger UI
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDefinition));

// body-parser middleware
app.use(bodyParser.json());
// dev log middleware
if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

/**
 * Managing Routes
 */
app.get("/App", function (req, res) {
  res.json({
    Tutorial: "Build REST API with Node.JS & MongoDB!!",
  });
});
//  app.get("/Email", function (req, res) {
// 	 res.render(cancelEmail.ejs);
//  });

/**
 * Routes
 */
// Admin APIs Route
const verifyUserToken =require('./app/middlewares/verifyUserToken');
app.use("/v1/user",verifyUserToken)
const verifyRunnerToken =require('./app/middlewares/verifyRunnerToken');
app.use("/v1/runner",verifyRunnerToken)
const verifyLaundryManToken =require('./app/middlewares/verifyLaundryManToken');
app.use("/v1/laundryman",verifyLaundryManToken)
// const veriryAddtocartToken = require('./app/middlewares/');
// app.use("/v1/addtocart",veriryAddtocartToken) 

const userRoutes = require("./app/routes/user");
const userAuthRoutes = require("./app/routes/userAuth");
const runnerRoutes = require("./app/routes/runner");
const runnerAuthRoutes = require("./app/routes/runnerAuth");
const laundryManRoutes = require("./app/routes/laundry");
const ordersRoutes = require("./app/routes/orders")
const walletRoutes = require("./app/routes/wallet")
const addtocartRouts = require("./app/routes/addtocart");
app.use("/v1/user", userRoutes);
app.use("/v1/auth/user", userAuthRoutes);
app.use("/v1/runner", runnerRoutes);
app.use("/v1/auth/runner", runnerAuthRoutes);
app.use("/v1/auth/laundryman", laundryManRoutes);
app.use("/v1/laundryman", laundryManRoutes);
app.use("/v1/orders", ordersRoutes);
app.use("/v1/wallet", walletRoutes);
app.use("/v1/addtocart",addtocartRouts);



/**
 * Impliment Authenticate
 */
require("./app/middlewares/verifyToken")(passport); // to verify token

/**
 * Handling 404, 500 Errors
 */
app.use(function (err, req, res, next) {
  if (err.status === 404)
    res.status(404).json({
      message: "Not found",
    });
  else
    res.status(500).json({
      message: "Internal Server Error",
      err: util.inspect(err),
    });
});

/**
 * Set Static Client Folder
 */
app.use(express.static(path.join(__dirname, "build")));

//Angular build mode
//  app.get('/', (req, res) => {
// 	 res.sendFile(path.join(__dirname + '/build/index.html'));
//  })

/**
 * Server Connection
 */
const PORT = process.env.PORT || 6000;
// // Local Server
const server = app.listen(PORT, function () {
  console.log(
    `${process.env.NODE_ENV} Application running locally at  http://localhost:${PORT}`
      .yellow.bold
  );
});

// // secure server
//  let server = https.createServer(options, app)
//  server.listen(PORT, err => {
//  	console.log(`${process.env.NODE_ENV} Secure Application running at  https://everlio.com:${PORT}`.yellow.bold);
//  });

/**
 * Set Static Client Folder
 */
// app.use(express.static(path.join(__dirname, "app/externalApp")));

// //  //Angular build mode
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname + "/app/externalApp/index.html"));
// });
