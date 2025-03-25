const { AddCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require("../controllers/category.controller");

const router = require("express").Router();

router.post("/", AddCategory);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
