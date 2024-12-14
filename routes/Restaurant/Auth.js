const { RestaurantAuthController } = require("../../controller/Restaurant")
const { LoginRules, UpdatePasswordRule } = require("../../middleware/validation")

const router = require("express").Router()

router.post("/login", LoginRules, RestaurantAuthController.login)
router.post("/reset", RestaurantAuthController.resetPassword)
router.put("/password", UpdatePasswordRule, RestaurantAuthController.updatePassword)

module.exports = router