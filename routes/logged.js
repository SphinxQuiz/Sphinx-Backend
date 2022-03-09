const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const loggedCtrl = require("../controllers/logged");
const auth = require("../middleware/auth");

router.post("/quiz", auth);
router.post("/profile", auth);
router.get("/leaderboard", auth);

module.exports = router;
