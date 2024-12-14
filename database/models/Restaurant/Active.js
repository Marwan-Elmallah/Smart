const { DataTypes } = require("sequelize");
const { sequelize } = require("../..");
const CryptoJS = require("crypto-js");

const config = require("../../../config");

const Restaurant = sequelize.define("Restaurant", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            name: 'Restaurant Email',
            msg: 'Email address must be unique.',
        },
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    level: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "admin",
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    defaultScope: {
        attributes: { exclude: ['createdAt', 'password'] }
    }
})

Restaurant.beforeCreate(async (restaurant) => {
    const ciphertext = CryptoJS.AES.encrypt(restaurant.password, config.BCRYPT_SEKRET_KEY).toString();
    restaurant.password = ciphertext;
})

Restaurant.beforeUpdate(async (restaurant) => {
    if (restaurant.changed('password')) {
        const ciphertext = CryptoJS.AES.encrypt(restaurant.password, config.BCRYPT_SEKRET_KEY).toString();
        restaurant.password = ciphertext;
    }
});

module.exports = Restaurant