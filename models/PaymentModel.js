

const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");

const { DataTypes } = Sequelize;

const Payments = db.define('payment', {
    paymentId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: function () {
            // Generate a random string of length 6 to 7 characters
            const randomString = Math.random().toString(36).substring(2, 9);
            return randomString;
        },
        validate: {
            // Validate the length of the UUID
            len: [6, 7]
        }
    },
    enrollmentId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    paymentDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false
    },
    balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    createdByName: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    freezeTableName: true
});

module.exports = Payments;

