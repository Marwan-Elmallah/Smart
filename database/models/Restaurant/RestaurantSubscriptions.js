const { DataTypes } = require("sequelize");
const { sequelize } = require("../..");

const RestaurantSubscriptions = sequelize.define("RestaurantSubscription", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [["free", "paid"]],
    },
  },
},
  {
    defaultScope: {
      attributes: {
        exclude: ["updatedAt"],
      },
    },
  }
);

module.exports = RestaurantSubscriptions;
