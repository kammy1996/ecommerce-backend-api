// const express = require("express");
import express from "express";
const app = express();

//listening on this port
app.listen(3000);

app.get("/", function (req, res) {
  res.send("kamran");
});

console.log("application Listening on Port 3000");
