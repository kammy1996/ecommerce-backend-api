import express from "express";
const router = express.Router();
import verify from "../../helpers/verifyToken";

import conUserClient from "../../controllers/user/conUser";

router.post("/add", conUserClient.addUser);
router.post("/login", conUserClient.loginUser);
router.post("/cart/add", verify, conUserClient.addToUserCart);
router.get("/profile", verify, conUserClient.userProfile);
router.get("/cart/products", verify, conUserClient.getProductsFromUsersCart);
router.delete("/cart/delete/:id", verify, conUserClient.DeleteFromUserCart);
router.get("/confirmation/:token", conUserClient.verifyEmail);
router.get("/location", conUserClient.getLocations);
router.post("/user-details", verify, conUserClient.addUserDetails);
router.put(
  "/user-details/update/:address",
  verify,
  conUserClient.updateUserDetails
);
router.put(`/user-details/delete`, verify, conUserClient.deleteUserDetails);

module.exports = router;
