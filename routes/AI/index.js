const router = require("express").Router()
const AIController = require("../../controller/AI")

router.get("/", AIController.get)
router.post("/order", AIController.createOrder)
router.post("/customer", AIController.createCustomer)

module.exports = router