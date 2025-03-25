const { addView, getView, getViewById, updateView, deleteView } = require("../controllers/views.controller");

const router = require("express").Router();

router.post("/", addView);
router.get("/", getView);
router.get("/:id", getViewById);
router.put("/:id", updateView);
router.delete("/:id", deleteView);

module.exports = router;
