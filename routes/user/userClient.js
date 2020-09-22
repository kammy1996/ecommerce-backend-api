import express from "express";
const router = express.Router();
import verify from "../../helpers/verifyToken";

import conUserClient from "../../controllers/user/conUser";

router.post("/add", conUserClient.addUser);
router.post("/login", conUserClient.loginUser);
router.get("/profile", verify, conUserClient.userProfile);

module.exports = router;
