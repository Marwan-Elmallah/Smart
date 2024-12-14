const router = require("express").Router()
const AuthAgentController = require("../../controller/Agent/auth")

router.post("/login", AuthAgentController.login)
router.post("/reset", AuthAgentController.resetPassword)
router.put("/password", AuthAgentController.updatePassword)
router.post("/encrypt", AuthAgentController.encryptPassword)

module.exports = router