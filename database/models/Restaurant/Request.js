const { DataTypes } = require("sequelize");
const { sequelize } = require("../..");

const RestaurantRequest = sequelize.define("RestaurantRequest", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    jobTitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    restaurantName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
        validate: {
            isIn: [["pending", "approved", "rejected"]]
        },
    }
}, {
    defaultScope: {
        attributes: {
            exclude: ["updatedAt"],
        }
    }
})

module.exports = RestaurantRequest