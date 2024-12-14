const AgentController = require("../../controller/Agent/dashboard")
const { DeleteRule } = require("../../middleware/validation")

const router = require("express").Router()

router.get("/", AgentController.allAgents)
router.put("/", AgentController.update)
router.delete("/", DeleteRule, AgentController.delete)
router.use("/auth", require("./auth"))
router.get("/restaurantOrder", AgentController.RestaurantOrder)


module.exports = router