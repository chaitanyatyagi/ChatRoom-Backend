const express = require("express")
const router = express.Router()
const messageController = require("../controllers/messageController")

router.route("/addmsg").post(messageController.addMessage)
router.route("/getmsg").post(messageController.getMessage)

module.exports = router