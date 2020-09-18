import express from "express";
const router = express.Router();

import conProductClient from "../controllers/ConProductClient";

router.get("/price/filter", conProductClient.priceFilter);

module.exports = router;
