const { DataTypes } = require("sequelize");
const { sequelize } = require("../..");
const Company = require("./company");

const Subscription = sequelize.define('Subscription', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
    },
    numberOfMinutes: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0
    },
    tier: {
        type: DataTypes.STRING,
        allowNull: false,
        enum: ["demo", "Tier1", "Tier2", "Tier3", "Tier4"]
    }
}, {
    hooks: {
        beforeCreate: (subscription, options) => {
            // Set the endDate attribute
            const startDate = subscription.startDate;
            const endDate = new Date(startDate);
            if (options.isTrial) {
                endDate.setDate(startDate.getDate() + 7); // Trial period for 1 week
            } else {
                endDate.setMonth(startDate.getMonth() + 1); // Regular subscription for 1 month
            }
            subscription.endDate = endDate;
        }
    }
});

Subscription.beforeSave(async (subscription) => {
    if (subscription.changed('numberOfMinutes')) {
        if (subscription.tier === "demo") {
            if (subscription.numberOfMinutes > 20) {
                const company = await Company.findByPk(subscription.companyId)
                await company.update({ status: false })
            }
        } else {
            if (subscription.numberOfMinutes <= 6000) {
                subscription.tier = "Tier1";
            } else if (subscription.numberOfMinutes > 6000 && subscription.numberOfMinutes <= 12000) {
                subscription.tier = "Tier2";
            } else if (subscription.numberOfMinutes > 12000 && subscription.numberOfMinutes <= 30000) {
                subscription.tier = "Tier3";
            } else {
                subscription.tier = "Tier4";
            }
        }
    }
});

module.exports = Subscription;
