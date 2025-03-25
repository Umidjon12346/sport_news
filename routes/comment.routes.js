const { addComment, getComment, getCommentById, updateComment, deleteComment } = require("../controllers/comments.controller");

const router = require("express").Router();

router.post("/", addComment);
router.get("/", getComment);
router.get("/:id", getCommentById);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

module.exports = router;
