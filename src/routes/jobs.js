const express = require("express");
const router = express.Router();

const { getJobsUnpaid, postJobPay } = require("../controllers/jobs");

router.get("/unpaid", getJobsUnpaid);
router.post("/:job_id/pay", postJobPay);

module.exports = router;