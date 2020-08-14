import express from "express";
const router = express.Router();

//Importing Main Controller
import conProduct from "../controllers/ConProduct";

//Defining functions as per Routes
router.post("/add", conProduct.add); //Showing all the products
router.get("/show", conProduct.show); //Showing all the products

//Exporting Router
module.exports = router;
