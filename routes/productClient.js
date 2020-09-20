import express from "express";
const router = express.Router();

import conProductClient from "../controllers/ConProductClient";

router.get("/price/:min/:max", conProductClient.priceFilter);
router.get("/sort/price/:sequence", conProductClient.sortProductsByPrice);
router.get("/search/:name", conProductClient.searchProductByName);
router.post("/cart/:id", conProductClient.addProductToCart);
router.get("/cart/fetch", conProductClient.getProductsFromCart);

module.exports = router;
