// const express = require("express");
import express from "express";
const app = express();

const names = [];

//listening on this port
app.listen(3000);

app.use(express.json());

app.get("/", function (req, res) {
  res.send("mem");
});

app.post("/getName", function (req, res) {
  let addName = {
    id: 0,
    name: req.body.name,
  };
  names.push(addName);
  res.send(names);
});

console.log(names);
