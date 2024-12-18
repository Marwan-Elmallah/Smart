const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        dialect: process.env.DB_DIALECT,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        logging: false, //logger.info
    }
);

exports.sequelize = sequelize;

const Restaurant = require("./models/Restaurant/Active");
const Menu = require("./models/Menu");
const RestaurantRequest = require("./models/Restaurant/Request");
const Agent = require("./models/Agent");
const User = require("./models/Restaurant/User");
const Customer = require("./models/Restaurant/Customer");
const MenuItem = require("./models/Menu/Item");
const Category = require("./models/Menu/category")
const Company = require("./models/STT/company");
const AudioFile = require("./models/STT/AudioFile");
const Subscription = require("./models/STT/Subscription");
const Billing = require("./models/STT/Billing");
const Order = require("./models/Order");
const RestaurantSubscription = require("./models/Restaurant/RestaurantSubscriptions");



// Relationships

Restaurant.belongsTo(RestaurantRequest, {
    foreignKey: "restaurantRequestId",
    targetKey: "id",
    onDelete: "CASCADE",
})

Restaurant.hasMany(RestaurantSubscription, {
    foreignKey: "restaurantId",
    targetKey: "id",
});

RestaurantSubscription.belongsTo(Restaurant, {
    foreignKey: "restaurantId",
    targetKey: "id",
    onDelete: "CASCADE",
});

Customer.belongsTo(Restaurant, {
    foreignKey: "restaurantId",
    targetKey: "id",
    onDelete: "CASCADE",
})

Menu.belongsTo(Restaurant, {
    foreignKey: "restaurantId",
    targetKey: "id",
    onDelete: "CASCADE",
})
// Menu.hasMany(Category);

Category.belongsTo(Menu, {
    foreignKey: "menuId",
    targetKey: "id",
    onDelete: "CASCADE",
})

MenuItem.belongsTo(Category)
Category.hasMany(MenuItem, {
    foreignKey: "categoryId",
    targetKey: "id",
    onDelete: "CASCADE",
});

MenuItem.belongsTo(Menu, {
    foreignKey: "menuId",
    targetKey: "id",
    onDelete: "CASCADE",
})

Order.belongsTo(Restaurant, {
    foreignKey: "restaurantId",
    targetKey: "id",
    onDelete: "CASCADE",
})

Order.belongsTo(Customer, {
    foreignKey: "customerId",
    targetKey: "id",
    onDelete: "CASCADE",
})

User.belongsTo(Restaurant, {
    foreignKey: "restaurantId",
    targetKey: "id",
    onDelete: "CASCADE",
})

AudioFile.belongsTo(Company, {
    foreignKey: "companyId",
    targetKey: "id",
    onDelete: "CASCADE",
})

Subscription.belongsTo(Company, {
    foreignKey: "companyId",
    targetKey: "id",
    onDelete: "CASCADE",
})
Company.belongsTo(Subscription, {
    foreignKey: "currentSubscriptionId",
    targetKey: "id",
})
Subscription.belongsTo(Billing, {
    foreignKey: "currentBillingId",
    targetKey: "id",
    onDelete: "CASCADE",
})


Billing.belongsTo(Subscription, {
    foreignKey: "subscriptionId",
    targetKey: "id",
    onDelete: "CASCADE",
})


const models = {
    Agent,
    Restaurant,
    RestaurantRequest,
    Menu,
    MenuItem,
    User,
    Customer,
    Category,
    Company,
    AudioFile,
    Subscription,
    Billing,
    Order,
    RestaurantSubscription
}



// async function checkAndCreateTables() {
//     try {
//         const tableExists = await sequelize.getQueryInterface().showAllTables();
//         for (const modelName in models) {
//             if (tableExists.includes(modelName)) {
//                 console.log(`Table '${modelName}' does not exist, creating...`);
//                 await models[modelName].sync({ alter: true });
//                 console.log(`Table '${modelName}' created.`);
//             } else {
//                 console.log(`Table '${modelName}' exists.`);
//             }
//             // if (Object.hasOwnProperty.call(models, modelName)) {
//             //     const model = models[modelName];
//             //     const tableName = model.tableName;
//             //     console.log(tableExists);
//             //     if (!tableExists.includes(tableName)) {
//             //         console.log(`Table '${tableName}' does not exist, creating...`);
//             //         await model.sync({ alter: true });
//             //         console.log(`Table '${tableName}' created.`);
//             //     }
//             // }
//         }
//         console.log('All tables checked and created if necessary.');
//     } catch (error) {
//         console.error('Error checking or creating tables:', error);
//     }
// }

module.exports = { models, sequelize }