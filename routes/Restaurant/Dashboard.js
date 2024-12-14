const router = require("express").Router()

const DashboardController = require("../../controller/Restaurant/Dashboard")

router.get("/totalSales", DashboardController.totalSales)
router.get("/favItems", DashboardController.mostItemsOrder)

module.exports = router