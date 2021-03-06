const express = require("express")
const router = express.Router();

// Importing Custom modules
const fileUpload = require("../../helpers/fileUpload");
let upload = fileUpload.upload;

//Importing Main Controller
const conProduct = require("../../controllers/product/ConProduct");

//Defining functions as per Routes
router.post("/add", conProduct.add); //Showing all the products
router.get("/show", conProduct.show); //Showing all the products
router.post("/category/add", conProduct.catAdd); //Adding new Category
router.get("/category/show", conProduct.catShow); // Displaying the category
router.post("/stock/add", conProduct.stockAdd);
router.post("/image/add", upload.array("files"), conProduct.imageAdd);
router.get("/image/show", conProduct.showImages);
router.get("/:id", conProduct.getProductById);
router.put("/update/:id", conProduct.updateProduct);
router.get("/fetch/image/:id", conProduct.getProductImagesById);
router.get("/fetch/stock/:id", conProduct.getProductStock);
router.post(
  "/update/image/new/:stockId",
  upload.array("files"),
  conProduct.updateNewImages
);
router.put("/update/existing/image", conProduct.updateExistingImage);
router.post(`/update/add/stock/:id`, conProduct.updateNewStock);
router.put(`/update/delete/stock/:stockId`, conProduct.deleteStock);
router.get(`/related/:id`, conProduct.getRelatedProducts);
router.get("/show/:perPage/:page", conProduct.productsAsPerPagination);

//Exporting Router
module.exports = router;
