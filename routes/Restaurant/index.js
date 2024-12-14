const router = require("express").Router()
const ResturantsRequestRoutes = require("./Request")
const RestaurantRoutes = require("./Active")
const UserRoutes = require("./User")
const CustomerRoutes = require("./Customer")
const AuthRoutes = require("./Auth")
const DashboardRoutes = require("./Dashboard")

router.use("/request", ResturantsRequestRoutes)
router.use("/active", RestaurantRoutes)
router.use("/user", UserRoutes)
router.use("/customer", CustomerRoutes)
router.use("/auth", AuthRoutes)
router.use("/dashboard", DashboardRoutes)

module.exports = router