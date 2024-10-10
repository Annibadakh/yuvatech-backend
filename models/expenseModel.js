// models/expenseModel.js
const Expense = require('./Expense');

class ExpenseModel {
    // Method to get the list of all expenses
    static async getAllExpenses() {
        try {
            const expenses = await Expense.findAll();
            return expenses;
        } catch (err) {
            throw err; // Propagate the error
        }
    }

    // Method to insert a new expense
    static async createExpense(title, amount) {
        try {
            const expense = await Expense.create({
                title,
                amount,
            });
            return expense;
        } catch (err) {
            throw err; // Propagate the error
        }
    }

    // Method to update an existing expense
    static async updateExpense(id, title, amount) {
        try {
            const expense = await Expense.update(
                { title, amount },
                {
                    where: { id },
                }
            );
            return expense; // Return the result
        } catch (err) {
            throw err; // Propagate the error
        }
    }
}

module.exports = ExpenseModel;
