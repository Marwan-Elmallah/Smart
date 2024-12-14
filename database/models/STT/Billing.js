const { DataTypes } = require("sequelize");
const { sequelize } = require("../..");

const Billing = sequelize.define('Billing', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstTierCost: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    secondTierCost: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    thirdTierCost: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    fourthTierCost: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    totalCost: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    }
}, {
    defaultScope: {
        attributes: {
            exclude: ['updatedAt', "createdAt"]
        }
    }
})


module.exports = Billing