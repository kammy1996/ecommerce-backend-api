// const express = require("express");
"use strict";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import fs from "fs";
const port = 3000;
const app = express();

app.use(cors()); // to get Data from Other Domains
app.use(bodyParser.urlencoded({ extended: false })); // To Parse the body data
app.use(bodyParser.json()); //to Parse the Json Data

//Custom modules
import sqlConfig from "./database/dbConfig";
let sql = sqlConfig.mysql_pool;

// --------------------------- Need to Restructure --------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create folder as per product id
    const dir = `./uploads/`;

    fs.exists(dir, (exist) => {
      if (!exist) {
        return fs.mkdir(dir, (error) => cb(error, dir));
      }
      return cb(null, dir);
    });
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
  // let finalImages = [];
  for (var i = 0; i < imageName.length; i++) {
    let name = imageName[i].filename;
    fileNames.push([name]);
  }

  res.json("images uploaded Successfuly");

  let addImages = `INSERT INTO product_images(file_name) VALUES ?`;
  sql.query(addImages, [fileNames], (err, result) => {
    if (err) throw err;
    console.log(`product Images added`);
  });
});
// ---------

//To show the Index page
app.get("/", function (req, res) {
  res.send("Application Started");
  console.log("Application Started");
});

//Routes
//Routes
app.use("/api/product", require("./routes/product"));

//listening on this port
app.listen(port, () => console.log("listening on port" + port));
