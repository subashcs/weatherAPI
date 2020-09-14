const { Router } = require("express");
const auth = require("../middlewares/auth");

const { weatherController } = require("../controllers/weather.controller.js");
let router = new Router();
router.route("/").get(auth, weatherController.getWeather);

module.exports = router;
