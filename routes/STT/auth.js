const { AuthController } = require("../../controller/STT")
const { CompanyRegisterRule, UpdatePasswordRule, CompanyLoginRule, DeleteRule } = require("../../middleware/validation")
const router = require("express").Router()
const { uploadImage } = require("../../middleware/uploadImage")

router.post("/login", CompanyLoginRule, AuthController.login)
router.post("/reset", AuthController.resetPassword)
router.put("/password", AuthController.updatePassword)
router.post("/register", CompanyRegisterRule, AuthController.register)

router.get("/", AuthController.allCompanies)
router.put("/", AuthController.update)
router.delete("/", DeleteRule, AuthController.delete)
router.put("/image", uploadImage, AuthController.updateImage)

module.exports = router