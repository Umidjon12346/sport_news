const { addLike, getLike, getLikeById, updateLike, deleteLike } = require("../controllers/likes.controller");

const router = require("express").Router();

router.post("/", addLike);
router.get("/", getLike);
router.get("/:id", getLikeById);
router.put("/:id", updateLike);
router.delete("/:id", deleteLike);

module.exports = router;
