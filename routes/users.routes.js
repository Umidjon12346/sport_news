const { AddUser, getUsers, getUserById, updateUser, deleteUser } = require("../controllers/users.controller");

const router = require("express").Router();

router.post("/", AddUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
