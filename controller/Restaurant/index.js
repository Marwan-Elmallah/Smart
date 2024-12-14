const RestaurantsRequestController = require('./Request');
const RestaurantController = require('./Active');
const RestaurantUserController = require('./User');
const RestaurantCustomerController = require('./Customer');
const RestaurantAuthController = require("./auth")
const DashboardController = require("./Dashboard")

module.exports = {
    RestaurantsRequestController,
    RestaurantAuthController,
    RestaurantController,
    RestaurantUserController,
    RestaurantCustomerController,
    DashboardController
}
