// const UserController = require("../../controller/Restaurant/User")
const { RestaurantUserController } = require("../../controller/Restaurant")
const { checkAuthrizationRestaurant } = require("../../middleware/checkAuth")
const { authorize, restaurantRule } = require("../../middleware/checkRole")
const { UserCreateRule, DeleteRule, updateUserRule } = require("../../middleware/validation")

const router = require("express").Router()

router.get("/", RestaurantUserController.allUsers)
router.post("/", checkAuthrizationRestaurant, authorize(restaurantRule.admin), UserCreateRule, RestaurantUserController.create)
router.put("/", checkAuthrizationRestaurant, authorize(restaurantRule.admin), updateUserRule, RestaurantUserController.update)
router.delete("/", checkAuthrizationRestaurant, authorize(restaurantRule.admin), DeleteRule, RestaurantUserController.delete)

module.exports = router