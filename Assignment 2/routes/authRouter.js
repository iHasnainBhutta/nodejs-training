const express = require("express");
const router = express.Router();
const postController = require("../controllers/authController");
const jwtMiddleware = require("../middlewares/auth");

router.post("/user-register", postController.userRegister);
router.post("/user-login", jwtMiddleware, postController.userLogin);
router.put("/user-update/:id", postController.updateUser);
router.delete("/delete-user/:id", postController.userDelete);

module.exports = router;
