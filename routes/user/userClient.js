import express from "express";
const router = express.Router();
import verify from "../../helpers/verifyToken";

import conUserClient from "../../controllers/user/conUser";

router.post("/add", conUserClient.addUser);
router.post("/login", conUserClient.loginUser);
router.post("/cart/:id", verify, conUserClient.addToUserCart);
router.get("/profile", verify, conUserClient.userProfile);
router.get("/cart/products", verify, conUserClient.getProductsFromUsersCart);
router.delete("/cart/delete/:id", verify, conUserClient.DeleteFromUserCart);

module.exports = router;
