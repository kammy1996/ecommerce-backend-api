import express from "express";
const router = express.Router();

// Importing Custom modules
import fileUpload from "../helpers/fileUpload";
let upload = fileUpload.upload;

//Importing Main Controller
import conProduct from "../controllers/ConProduct";

//Defining functions as per Routes
router.post("/add", conProduct.add); //Showing all the products
router.get("/show", conProduct.show); //Showing all the products
router.post("/category/add", conProduct.catAdd); //Adding new Category
router.get("/category/show", conProduct.catShow); // Displaying the category
router.post("/stock/add", conProduct.stockAdd);
router.post("/image/add", upload.array("files"), conProduct.imageAdd);
router.get("/image/show", conProduct.showImages);
// ----------Multer File Upload  ----------

//Exporting Router
module.exports = router;
