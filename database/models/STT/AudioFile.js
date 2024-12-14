const { DataTypes } = require("sequelize");
const { sequelize } = require("../..");

const AudioFile = sequelize.define('AudioFile', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    filename: {
        type: DataTypes.STRING,
        allowNull: true
    },
    filepath: {
        type: DataTypes.STRING,
        allowNull: false
    },
    duration: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    text: {
        type: DataTypes.STRING,
        allowNull: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        enum: ["file", "record", "link"]
    }
    // Add more columns as needed
});

module.exports = AudioFile