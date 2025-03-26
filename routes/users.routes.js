const {
  AddUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  refreshTokenUser,
  userActivee,
} = require("../controllers/users.controller");

const router = require("express").Router();

router.post("/", AddUser);
router.get("/", getUsers);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh",refreshTokenUser)
router.get("/activate/:link", userActivee);

router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
