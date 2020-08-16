import express from "express";
const router = express.Router();

//Importing Main Controller
import conProduct from "../controllers/ConProduct";

//Defining functions as per Routes
router.post("/add", conProduct.add); //Showing all the products
router.get("/show", conProduct.show); //Showing all the products
router.post("/category/add", conProduct.catAdd); //Adding new Category
router.get("/category/show", conProduct.catShow); // Displaying the category
router.post("/stock/add", conProduct.addStock);

//Exporting Router
module.exports = router;
