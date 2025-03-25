const { addNotifaction, getNotifaction, getNotifactionById, updateNotifaction, deleteNotifaction } = require("../controllers/notifaction.controller");

const router = require("express").Router();

router.post("/", addNotifaction);
router.get("/", getNotifaction);
router.get("/:id", getNotifactionById);
router.put("/:id", updateNotifaction);
router.delete("/:id", deleteNotifaction);

module.exports = router;
