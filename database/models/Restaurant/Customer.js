const { DataTypes } = require("sequelize");
const { sequelize } = require("../..");

const Customer = sequelize.define("customer", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            name: 'Phone Number',
            msg: 'phone number must be unique.',
        },
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    defaultScope: {
        attributes: { exclude: ['createdAt', 'updatedAt'] }
    }
})

module.exports = Customer