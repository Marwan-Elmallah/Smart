const { DataTypes } = require("sequelize");
const { sequelize } = require("../..");

const Agent = sequelize.define("agent", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: {
            name: 'Agent Email',
            msg: 'Email address must be unique.',
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    level: {
        type: DataTypes.STRING,
        defaultValue: "super",
    }
}, {
    defaultScope: {
        attributes: {
            exclude: ['updatedAt', "createdAt"]
        }
    },
})


module.exports = Agent