// const express = require("express");
"use strict";

// import express from "express";
// import cors from "cors";
// import bodyParser from "body-parser";
// import cookieParser from "cookie-parser";

const express = require("express")
const cors = require("cors");
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

const app = express();
app.use(cookieParser());
app.use(cors()); // to get Data from Other Domains
app.use(bodyParser.urlencoded({ extended: false })); // To Parse the body data
app.use(bodyParser.json()); //to Parse the Json Data
app.use("/", express.static("public/uploads/products")); //For frontend to access this folder

//To show the Index page
app.get("/", function (req, res) {
  console.log("Application Started");
  res.send("application Started");
});


// Routes
// -- PRODUCT--
app.use("/api/product",require("./routes/product/product"));
app.use("/api/product/client", require("./routes/product/productClient"));
//--USER--
app.use("/api/user", require("./routes/user/userClient"));

//listening on this port
const port = process.env.PORT || 5000;

app.listen(port|| 5000);
console.log(`app listening on${port}`)
