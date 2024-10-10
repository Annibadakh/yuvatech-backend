// controllers/amountController.js
const AmountModel = require("../models/amountModel");

exports.getAmountList = async (req, res) => {
    try {
        const amountData = await AmountModel.getLatestAmount();
        return res.json({
            success: true,
            message: "Total amount data retrieved successfully",
            amountdata: amountData,
        });
    } catch (err) {
        return res.json({
            success: false,
            message: "Error retrieving total amount data",
            error: err.message,
        });
    }
};

exports.initialValues = async (req, res) => {
    const { sendtotalamount, sendexpenses, sendbalance } = req.body;

    // Validate required fields
    if (sendtotalamount == null || sendbalance == null || sendexpenses == null) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    try {
        await AmountModel.insertInitialValues(sendtotalamount, sendexpenses, sendbalance);
        console.log('Amount Stored Successfully!');
        res.json({ success: true });
    } catch (err) {
        console.error('Error inserting data:', err);
        return res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
};








// const db = require("../config/Database.js");

// exports.getAmountList = (req, res) => {
//     const sql = "SELECT * FROM amount ORDER BY id DESC LIMIT 1";
//     db.query(sql, (err, amountdata) => {
//         if (err) {
//             return res.json({ success: false, message: "Error retrieving total amount data", error: err });
//         } else {
//             return res.json({ success: true, message: "Total amount data retrieved successfully", amountdata: amountdata });
//         }
//     });
// };

// exports.initialValues = (req, res) => {
//     const { sendtotalamount, sendexpenses, sendbalance } = req.body;

//     // Validate required fields
//     if (sendtotalamount == null || sendbalance == null || sendexpenses == null) {
//         return res.status(400).json({ error: 'Missing required fields.' });
//     }

//     // Perform database query
//     db.query(
//         "INSERT INTO amount (totalamount, expenses, balance, currdate, currtime) VALUES (?, ?, ?, CURDATE(), CURTIME())",
//         [sendtotalamount, sendexpenses, sendbalance],
//         (err, result) => {
//             if (err) {
//                 console.error('Error inserting data:', err);
//                 return res.status(500).json({ error: 'An error occurred while processing your request.' });
//             }

//             console.log('Amount Stored Successfully!');
//             res.json({ success: true });
//         }
//     );
// };

