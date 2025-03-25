const { AddNews, getNews, getNewsById, updateNews, deleteNews } = require("../controllers/news.controller");

const router = require("express").Router();

router.post("/", AddNews);
router.get("/", getNews);
router.get("/:id", getNewsById);
router.put("/:id", updateNews);
router.delete("/:id", deleteNews);

module.exports = router;
