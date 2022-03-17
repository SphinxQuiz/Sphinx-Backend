const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const userCtrl = require("../controllers/user");
const auth = require("../middleware/auth")


router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.get("/verify/:id", userCtrl.verify);
router.post("/getInfos", auth, userCtrl.getInfo);
router.post("/getLeaderboard", auth, userCtrl.getLeaderboard);


module.exports = router;
