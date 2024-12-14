const { RestaurantsRequestController } = require("../../controller/Restaurant")
const { RestaurantRequestRules } = require("../../middleware/validation")

const router = require("express").Router()

router.get("/", RestaurantsRequestController.allRequests)
router.post("/", RestaurantRequestRules, RestaurantsRequestController.create)

module.exports = router