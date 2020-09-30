import express from "express";
const router = express.Router();

import conProductClient from "../../controllers/product/ConProductClient";

router.get("/price/:min/:max", conProductClient.priceFilter);
router.get("/sort/price/:sequence", conProductClient.sortProductsByPrice);
router.get("/search/:name", conProductClient.searchProductByName);
// router.post("/cart/:id", conProductClient.addProductToCart);
// router.get("/cart/fetch", conProductClient.getProductsFromCart);
// router.delete(`/cart/delete/:id`, conProductClient.deleteFromCart);
// router.get(`/cart/count`, conProductClient.getCartCount);

module.exports = router;
