const { DataTypes } = require("sequelize");
const { sequelize } = require("..");

const Order = sequelize.define("Order", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "received",
        validate: {
            isIn: [["received", "in progress", "completed", "cancelled"]]
        }
    },
    total: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    items: {
        type: DataTypes.JSON,
        allowNull: false
    },
    orderType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [["delivery", "takeaway"]]
        },
        defaultValue: "delivery"
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [["cash", "bank card", "visa"]]
        },
        defaultValue: "cash"
    }
}, {
    defaultScope: {
        attributes: {
            exclude: ['updatedAt']
        }
    },
});

module.exports = Order;