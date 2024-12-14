const WebHooksRoutes = require("./webhook");
const RestaurantRoutes = require("./Restaurant")
const AgentRoutes = require("./Agent")
const MenuRoutes = require("./Menu")
const STTroutes = require("./STT")
const OrderRoutes = require("./Order");
const AiRoutes = require("./AI")
const { checkAuthrizationRestaurant, checkAuthrizationAi } = require("../middleware/checkAuth");
const { authorize, restaurantRule } = require("../middleware/checkRole");
module.exports = (app) => {
    // all Routes Here 

    app.use("/restaurant", RestaurantRoutes);

    app.use("/agent", AgentRoutes)

    app.use("/menu", checkAuthrizationRestaurant, authorize(restaurantRule.manager), MenuRoutes)

    app.use("/order", OrderRoutes)

    app.use("/stt", STTroutes)

    app.use("/ai", checkAuthrizationAi, AiRoutes)

    // webHook Routes Used Later
    app.use('/webhook', WebHooksRoutes);

    //  Server Status 
    app.get('/status', (req, res) => {
        const date =
            new Date().getUTCFullYear() +
            '-' +
            new Date().getUTCMonth() +
            '-' +
            new Date().getUTCDate() +
            '-' +
            (new Date().getUTCHours() + 2) +
            ':' +
            new Date().getUTCMinutes() +
            ':' +
            new Date().getUTCSeconds();
        res.json({
            Date: date,
            Status: 'online',
        });
    });

    app.get('/', (req, res) => {
        res.send('Ok');
    });
};
