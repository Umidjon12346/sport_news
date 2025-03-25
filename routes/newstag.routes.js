const { addNewsTag, getNewsTags, getNewsTagById, updateNewsTag, deleteNewsTag } = require("../controllers/newstag.controller");

const router = require("express").Router();

router.post("/", addNewsTag);
router.get("/", getNewsTags);
router.get("/:id", getNewsTagById);
router.put("/:id", updateNewsTag);
router.delete("/:id", deleteNewsTag);

module.exports = router;
