const { RestaurantCustomerController } = require("../../controller/Restaurant")
const { CustomerCreateRule, DeleteRule } = require("../../middleware/validation")

const router = require("express").Router()

router.get("/", RestaurantCustomerController.allCustomers)
router.post("/", CustomerCreateRule, RestaurantCustomerController.create)
router.put("/", RestaurantCustomerController.update)
router.delete("/", DeleteRule, RestaurantCustomerController.delete)

module.exports = router