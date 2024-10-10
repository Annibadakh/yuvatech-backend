// models/amountModel.js
const Amount = require('./Amount');

class AmountModel {
    // Method to get the latest amount data
    static async getLatestAmount() {
        try {
            const amountData = await Amount.findAll({
                order: [['id', 'DESC']],
                limit: 1,
            });
            return amountData;
        } catch (err) {
            throw err; // Propagate the error
        }
    }

    // Method to insert initial values into the amount table
    static async insertInitialValues(totalamount, expenses, balance) {
        try {
            const amount = await Amount.create({
                totalamount,
                expenses,
                balance,
            });
            return amount;
        } catch (err) {
            throw err; // Propagate the error
        }
    }
}

module.exports = AmountModel;
