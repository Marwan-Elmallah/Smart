const { DataTypes } = require("sequelize");
const { sequelize } = require("../..");

const Menu = sequelize.define("menu", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    defaultScope: {
        attributes: { exclude: ['createdAt', 'updatedAt'] }
    }
})


module.exports = Menu