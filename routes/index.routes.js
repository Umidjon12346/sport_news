const router = require("express").Router();
const langRouter = require("./langs.routes")
const categoRouter = require("./category.routes")
const newsRouter = require("./news.routes")
const usersRouter = require("./users.routes")
const newslangRouter = require("./newslang.routes")
const mediaRouter = require("./media.routes")
const commentRouter = require("./comment.routes")
const reportsRouter = require("./reports.routes")
const viewsRouter = require("./views.routes")
const likeRouter = require("./likes.routes")

router.use("/lang",langRouter)
router.use("/catego",categoRouter)
router.use("/news",newsRouter)
router.use("/users",usersRouter)
router.use("/newslang",newslangRouter)
router.use("/media",mediaRouter)
router.use("/comment",commentRouter)
router.use("/report",reportsRouter)
router.use("/view",viewsRouter)
router.use("/like",likeRouter)


module.exports = router