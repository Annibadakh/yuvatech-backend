

const express = require('express');
const { createPayment, updatePayment, deletePayment, getAllPayments, setFeesForEnrollment, getPaymentById,getBalanceByEnrollmentId, checkIfDiscountGiven,getDashboardFinancials,getMyPayments } = require('../controllers/PaymentController.js');
const { verifyUser } = require('../middleware/AuthUser.js');

const router = express.Router();

// Create a new student (accessible to admins only)
router.post('/payments', verifyUser, createPayment);
// router.get('/payment/:paymentId', verifyUser, getPaymentById);

router.post('/verifydiscount', verifyUser, checkIfDiscountGiven);


router.post('/set-fees', verifyUser, async (req, res) => {
    const { enrollmentId, discount } = req.body;

    if (!enrollmentId) {
        return res.status(400).json({ error: 'Enrollment ID is required' });
    }

    try {
        // Call setFeesForEnrollment function with enrollmentId and discount
        await setFeesForEnrollment(enrollmentId, discount);

        return res.status(200).json({ message: 'Fees updated successfully' });
    } catch (error) {
        console.error('Error setting fees:', error);
        return res.status(500).json({ error: 'Failed to set fees' });
    }
});
// Get all students (accessible to admins only)
router.get('/payments', verifyUser, getAllPayments);
router.get('/mypayments', verifyUser, getMyPayments);


// Get a specific student by ID (accessible to admins only)
router.get('/payments/:paymentId', verifyUser, getPaymentById);

// Update a student by ID (accessible to admins only)
router.patch('/payments/:paymentId', verifyUser, updatePayment);

// Delete a student by ID (accessible to admins only)
router.delete('/payments/:paymentId', verifyUser, deletePayment);

router.get('/payments/:enrollmentId', verifyUser, getBalanceByEnrollmentId);
router.get('/paymentsbalance/:enrollmentId', verifyUser, getBalanceByEnrollmentId);

router.get('/financials', verifyUser, getDashboardFinancials);

module.exports = router;
