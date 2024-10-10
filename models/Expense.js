// models/Expense.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/Database.js');

class Expense extends Model {}

Expense.init(
    {
        title: {
            type: DataTypes.STRING, // Assuming title is a string
            allowNull: false,
        },
        amount: {
            type: DataTypes.FLOAT, // Assuming amount is a float
            allowNull: false,
        },
        currdate: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW,
        },
        currtime: {
            type: DataTypes.TIME,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: 'Expense',
        tableName: 'expenses', // Use the existing table name
        timestamps: false, // Disable timestamps if the table does not have them
    }
);

module.exports = Expense;
