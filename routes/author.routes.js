const { addAuthor, getAuthor, getAuthorById, updateAuthor, deleteAuthor } = require("../controllers/author.controller");

const router = require("express").Router();

router.post("/", addAuthor);
router.get("/", getAuthor);
router.get("/:id", getAuthorById);
router.put("/:id", updateAuthor);
router.delete("/:id", deleteAuthor);

module.exports = router;
