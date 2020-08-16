// const express = require("express");
"use strict";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
const port = 3000;
const app = express();

app.use(cors()); // to get Data from Other Domains
app.use(bodyParser.urlencoded({ extended: false })); // To Parse the body data
app.use(bodyParser.json()); //to Parse the Json Data

// --------------------------- Need to Restructure --------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

// multer config
const upload = multer({
  storage: storage,
});

// Inserting into Database is pending
app.post("/api/image/add", upload.array("files"), (req, res) => {
  let imageName = req.files;
  let fileNames = [];
  for (var i = 0; i < imageName.length; i++) {
    fileNames.push(imageName[i].filename);
  }
  console.log(fileNames);
  res.json("images uploaded Successfuly");
});
// ---------

//To show the Index page
app.get("/", function (req, res) {
  res.send("Application Started");
  console.log("Application Started");
});

//Routes
app.use("/api/product", require("./routes/product"));

//listening on this port
app.listen(port, () => console.log("listening on port" + port));
