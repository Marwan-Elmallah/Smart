const router = require("express").Router()
const { RestaurantController } = require("../../controller/Restaurant")
const { RestaurantCreateRule, DeleteRule, RestaurantWithoutRequestCreateRule } = require("../../middleware/validation")

router.get("/", RestaurantController.allRestaurant)
router.post("/", RestaurantCreateRule, RestaurantController.create)
router.post(
    "/without-request",
    RestaurantWithoutRequestCreateRule,
    RestaurantController.storeRestaurant
);
router.delete("/", DeleteRule, RestaurantController.delete)
router.put("/", RestaurantController.update)


module.exports = router