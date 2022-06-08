const express = require("express");
const router = express.Router();

const { getContracts, getContractById } = require("../controllers/contracts");

router.get("/", getContracts);
router.get("/:id", getContractById);

module.exports = router;