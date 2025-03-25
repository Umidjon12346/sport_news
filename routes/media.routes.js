const { addMedia, getMedia, getMediaById, updateMedia, deleteMedia } = require("../controllers/media.controller");

const router = require("express").Router();

router.post("/", addMedia);
router.get("/", getMedia);
router.get("/:id", getMediaById);
router.put("/:id", updateMedia);
router.delete("/:id", deleteMedia);

module.exports = router;
