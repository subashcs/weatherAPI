const { Router } = require("express");
const auth = require("../middlewares/auth");

const { weatherController } = require("../controllers/weather.controller.js");
let router = new Router();
router.route("/").get(auth, weatherController.getWeather);

// exports.auth = function(req,res,next){
//     const userJwt = req.get("Authorization").slice("Bearer ".length)
//     const user = await User.decoded(userJwt)
//     var { error } = user
//     if (error) {
//       res.status(401).json({ error })
//       return
//     }
// }
module.exports = router;
