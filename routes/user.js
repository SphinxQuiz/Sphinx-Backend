const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const userCtrl = require("../controllers/user");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

model.exports = router;
