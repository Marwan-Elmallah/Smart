const { SubscriptionController } = require("../../controller/STT")
const { DeleteRule } = require("../../middleware/validation")

const router = require("express").Router()

router.get("/", SubscriptionController.allSubscription)
router.post("/", SubscriptionController.create)
router.put("/", SubscriptionController.update)
router.delete("/", DeleteRule, SubscriptionController.delete)

module.exports = router