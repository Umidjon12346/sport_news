const { addReport, getReports, getReportById, updateReport, deleteReport } = require("../controllers/reports.controller");

const router = require("express").Router();

router.post("/", addReport);
router.get("/", getReports);
router.get("/:id", getReportById);
router.put("/:id", updateReport);
router.delete("/:id", deleteReport);

module.exports = router;
