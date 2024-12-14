const { sequelize } = require("../..");
const { DataTypes } = require("sequelize");
const Category = require("./category");

const MenuItem = sequelize.define("menuItem", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    english_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    arabic_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    arabic_ingredients: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    english_ingredients: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    availability: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
}, {
    defaultScope: {
        attributes: { exclude: ['createdAt', 'updatedAt'] },
    }
})


module.exports = MenuItem