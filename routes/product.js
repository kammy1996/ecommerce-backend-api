import express from "express";
const router = express.Router();
import cors from "cors";
import bodyParser from "body-parser";

//Middleware
router.use(cors()); // to get Data from Other Domains
router.use(bodyParser.urlencoded({ extended: true })); // To Parse the body data

//Importing Main Controller
let conProduct = require("../controllers/ConProduct");

//Defining functions as per Routes
router.post("/add", conProduct.add); //Showing all the products
router.get("/get", conProduct.get); //Showing all the products

//Exporting Router
module.exports = router;
