const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const questionCtrl = require("../controllers/question");
const auth = require("../middleware/auth")

router.get("/getOne", auth, questionCtrl.getOne);
router.get("/getFromId/:id",questionCtrl.getFromId);


module.exports = router;
