const { AddLanguage, getLanguage, getLangById, updateLanguage, deleteLanguage } = require("../controllers/langs.controller")

const router = require("express").Router()


router.post("/",AddLanguage)
router.get("/",getLanguage)
router.get("/:id",getLangById)
router.put("/:id",updateLanguage)
router.delete("/:id",deleteLanguage)

module.exports = router