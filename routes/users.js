const { Router } = require("express");
const usersCtrl = require("../controllers//users.controller");

const router = new Router();

router.route("/register").post(usersCtrl.register);
router.route("/login").post(usersCtrl.login);

module.exports = router;
