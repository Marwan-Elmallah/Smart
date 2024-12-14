const router = require("express").Router()
const OrderController = require("../../controller/Order")


router.post("/", OrderController.create)
router.get("/", OrderController.AllOrder)
router.put("/", OrderController.update)
router.delete("/", OrderController.delete)


module.exports = router