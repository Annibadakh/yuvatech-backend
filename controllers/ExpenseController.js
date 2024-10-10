// controllers/expenseController.js
const ExpenseModel = require("../models/expenseModel");

exports.getExpenseList = async (req, res) => {
    console.log("Expenses List here");
    try {
        const expensesData = await ExpenseModel.getAllExpenses();
        return res.json({ success: true, data: expensesData });
    } catch (err) {
        return res.json({
            success: false,
            message: "Error retrieving expenses data",
            error: err.message,
        });
    }
};

exports.sendExpense = async (req, res) => {
    const { sendtitle, sendamount } = req.body;

    // Validate required fields
    if (!sendtitle || sendamount == null) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    try {
        await ExpenseModel.createExpense(sendtitle, sendamount);
        console.log('Data inserted successfully');
        return res.json({ success: true });
    } catch (err) {
        console.error('Error inserting data:', err);
        return res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
};

exports.updateExpense = async (req, res) => {
    const id = req.params.id;
    const { sendtitle, sendamount } = req.body;

    // Validate required fields
    if (!sendtitle || sendamount == null) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    try {
        const result = await ExpenseModel.updateExpense(id, sendtitle, sendamount);

        if (result[0] === 0) {
            return res.status(404).json({ error: 'No rows were updated.' });
        }

        console.log('Amount Updated Successfully !!');
        return res.json({ success: true });
    } catch (err) {
        console.error('Error updating data:', err);
        return res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
};










// const db = require("../config/Database.js");


// exports.getExpenseList = (req, res) => {
//     console.log("Expenses List here");
//     const sql = "SELECT * FROM expenses";
//     db.query(sql, (err, data) => {
//         if (err) {
//             return res.json({ success: false, message: "Error retrieving expenses data", error: err });
//         }
//         return res.json(data);
//     });
// };

// exports.sendExpense = (req, res) => {
//     const sql = "INSERT INTO expenses (title, amount, currdate, currtime) VALUES (?, ?, CURDATE(), CURTIME())";
//     const values = [
//         req.body.sendtitle,
//         req.body.sendamount
//     ];
//     db.query(sql, values, (err, result) => {
//         if (err) {
//             console.error('Error inserting data:', err);
//             res.status(500).json({ error: 'An error occurred while processing your request.' });
//             return;
//         }
//         console.log('Data inserted successfully');
//         res.json({ success: true });
//     });
// };

// exports.updateExpense = (req, res) => {
//     const id = req.params.id;
//     const { sendtitle, sendamount } = req.body;

//     if (!sendtitle || !sendamount) {
//         res.status(400).json({ error: 'Missing required fields.' });
//         return;
//     }

//     db.query('UPDATE expenses SET title = ?, amount = ? WHERE id = ?', [sendtitle, sendamount, id], (err, result) => {
//         if (err) {
//             console.error('Error updating data:', err);
//             res.status(500).json({ error: 'An error occurred while processing your request.' });
//             return;
//         }
//         if (result.affectedRows === 0) {
//             res.status(404).json({ error: 'No rows were updated.' });
//             return;
//         }
//         console.log('Amount Updated Successfully !!');
//         res.json({ success: true });
//     });
// };