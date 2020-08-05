// const express = require("express");
"use strict";

import express from "express";
const app = express();

//listening on this port
app.listen(3000);

app.get("/", function (req, res) {
  res.send("Application Started");
  console.log("Application Started");
});

//Routes
app.use("/product", require("./routes/product"));
