const router = require("express").Router()
const AuthRoutes = require("./auth")
const AudioFileRoutes = require("./AudioFile")
const SubscriptionRoutes = require("./Subscription")
const BillingRoutes = require("./Billing")
const { checkAuthrizationCompany } = require("../../middleware/checkAuth")


router.use("/auth", AuthRoutes)
router.use("/audiofile", checkAuthrizationCompany, AudioFileRoutes)
router.use("/subscription", checkAuthrizationCompany, SubscriptionRoutes)
router.use("/billing", BillingRoutes)

module.exports = router

