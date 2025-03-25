const { AddNewsLang, getNewsLang, getNewsLangById, updateNewsLang, deleteNewsLang } = require("../controllers/newslang.controller");

const router = require("express").Router();

router.post("/", AddNewsLang);
router.get("/", getNewsLang);
router.get("/:id", getNewsLangById);
router.put("/:id", updateNewsLang);
router.delete("/:id", deleteNewsLang);

module.exports = router;
