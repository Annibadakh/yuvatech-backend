// models/Amount.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/Database.js');

class Amount extends Model {}

Amount.init(
    {
        totalamount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        expenses: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        balance: {
            type: DataTypes.FLOAT,
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
        modelName: 'Amount',
        tableName: 'amount', // Specify the table name in your database
        timestamps: false, // Disable timestamps if not needed
    }
);

module.exports = Amount;
