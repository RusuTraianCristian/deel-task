const express = require("express");
const router = express.Router();

const { postBalanceDepositById } = require("../controllers/balances");

router.post("/deposit/:userId", postBalanceDepositById);

module.exports = router;