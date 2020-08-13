// const express = require("express");
"use strict";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
const port = 3000;
const app = express();

app.use(cors()); // to get Data from Other Domains
app.use(bodyParser.urlencoded({ extended: false })); // To Parse the body data
app.use(bodyParser.json()); //to Parse the Json Data

//To show the Index page
app.get("/", function (req, res) {
  res.send("Application Started");
  console.log("Application Started");
});

//Routes
app.use("/api/product", require("./routes/product"));

//listening on this port
app.listen(port, () => console.log("listening on port" + port));
