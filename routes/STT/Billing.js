const router = require("express").Router()
const BillingController = require("../../controller/STT/Billing")
const { checkAuthrizationCompany } = require("../../middleware/checkAuth")

router.post("/", BillingController.create)
router.get("/", checkAuthrizationCompany, BillingController.totalBilling)

module.exports = router