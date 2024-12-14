const CryptoJS = require("crypto-js");
const { DataTypes } = require("sequelize");
const { sequelize } = require("../..");
const config = require("../../../config");

const Company = sequelize.define("Company", {
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
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    defaultScope: {
        attributes: {
            exclude: ['updatedAt']
        }
    },
})

Company.beforeCreate(async (company) => {
    const ciphertext = CryptoJS.AES.encrypt(company.password, config.BCRYPT_SEKRET_KEY).toString();
    company.password = ciphertext;
});

Company.beforeUpdate(async (company) => {
    if (company.changed('password')) {
        const ciphertext = CryptoJS.AES.encrypt(company.password, config.BCRYPT_SEKRET_KEY).toString();
        company.password = ciphertext;
    }
});

module.exports = Company