const { DataTypes } = require("sequelize");
const { sequelize } = require("../..");

const CryptoJS = require("crypto-js");

const User = sequelize.define("user", {
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
            name: 'User Email',
            msg: 'Email address must be unique.',
        },
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    level: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['manager', 'employee']]
        },
        defaultValue: 'employee'
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

User.beforeCreate(async (user) => {
    if (user.changed('password')) {
        const ciphertext = CryptoJS.AES.encrypt(user.password, process.env.BCRYPT_SEKRET_KET).toString();
        user.password = ciphertext;
    }
})

User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
        const ciphertext = CryptoJS.AES.encrypt(user.password, process.env.BCRYPT_SEKRET_KET).toString();
        user.password = ciphertext;
    }
});

module.exports = User