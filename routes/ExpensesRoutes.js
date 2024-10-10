const express = require('express');
// const db = require('../db');
const router = express.Router();
const { verifyUser } = require('../middleware/AuthUser.js');
const { getExpenseList, sendExpense, updateExpense } = require('../controllers/ExpenseController.js');


router.get('/list', verifyUser, getExpenseList);
router.post('/send', verifyUser, sendExpense);
router.put('/update/:id', verifyUser, updateExpense);

// router.get('/list', (req, res) => {
//     const sql = "SELECT * FROM expenses";
//     db.query(sql, (err, data) => {
//         if (err) {
//             return res.json({ success: false, message: "Error retrieving expenses data", error: err });
//         }
//         return res.json(data);
//     });
// });

// router.post('/send', (req, res) => {
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
// });

// router.put('/update/:id', (req, res) => {
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
// });


module.exports = router;
