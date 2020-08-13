// const express = require("express");
"use strict";

import express from "express";
const app = express();
import cors from "cors";
const port = 3000;

app.use(cors()); // to get Data from Other Domains

//Routes
app.use("/product", require("./routes/product"));

app.get("/", function (req, res) {
  res.send("Application Started");
  console.log("Application Started");
});

//listening on this port
app.listen(port, () => console.log("listening on port" + port));
