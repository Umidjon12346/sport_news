const { addTag, getTag, getTagById, updateTag, deleteTag } = require("../controllers/tags.controller");

const router = require("express").Router();

router.post("/", addTag);
router.get("/", getTag);
router.get("/:id", getTagById);
router.put("/:id", updateTag);
router.delete("/:id", deleteTag);

module.exports = router;
