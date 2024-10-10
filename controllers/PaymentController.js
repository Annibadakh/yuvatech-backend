const Payments = require('../models/PaymentModel.js');
const Enrollment = require('../models/EnrollmentModel.js');
const Course = require('../models/CourseModel.js');
const Student = require('../models/StudentModel.js');
const { Sequelize } = require('sequelize');
const Fees = require('../models/Fees.js');

// exports.createPayment = async (req, res) => {
//     try {
//         const { enrollmentId, amount, paymentMethod } = req.body;
//         const createdBy = req.user.uuid;
//         const createdByName = req.user.name;

//         // Retrieve the enrollment with associated course details
//         const enrollment = await Enrollment.findByPk(enrollmentId, {
//             include: [
//                 {
//                     model: Payments,
//                     attributes: ['balance'],
//                     order: [['createdAt', 'DESC']],
//                     limit: 1
//                 },

//                 {
//                     model: Course,
//                     attributes: ['examFees', 'courseFees']
//                 }
//             ]
//         });


//         if (!enrollment) {
//             return res.status(404).json({ message: "Enrollment not found" });
//         }

//         if (!enrollment.course) {
//             console.error('Failed to retrieve course details:', enrollment);
//             return res.status(404).json({ message: "Course details not found for the enrollment" });
//         }

//         const { examFees, courseFees } = enrollment.course;
//         const initialBalance = examFees + courseFees; // Total amount due
//         const lastPayment = enrollment.payments[0]; // Assuming the first item is the most recent payment
//         const currentBalance = lastPayment ? lastPayment.balance : initialBalance;

//         if (currentBalance <= 0) {
//             return res.status(400).json({ message: "All payments have already been completed for this enrollment." });
//         }

//         if (amount > currentBalance) {
//             return res.status(400).json({ message: "Payment exceeds the remaining balance. No further payment required." });
//         }

//         const newBalance = currentBalance - amount;
//         const paymentDate = new Date();

//         const payment = await Payments.create({
//             enrollmentId,
//             amount,
//             paymentDate,
//             paymentMethod,
//             balance: newBalance,
//             createdBy,
//             createdByName
//         });

//         res.status(201).json({ message: "Payment created successfully", payment });
//     } catch (error) {
//         console.error("Error creating payment:", error);
//         res.status(500).json({ message: "Failed to create payment due to an internal error", error: error.message });
//     }
// };

//const { Enrollment, Payments, Fees, Course } = require('../models'); // Adjust the import based on your file structure

// exports.createPayment = async (req, res) => {
//     try {
//         const { enrollmentId, amount, paymentMethod } = req.body;
//         const createdBy = req.user.uuid;
//         const createdByName = req.user.name;

//         // Retrieve the enrollment with associated course details and the latest payment
//         const enrollment = await Enrollment.findByPk(enrollmentId, {
//             include: [
//                 {
//                     model: Payments,
//                     attributes: ['balance'],
//                     order: [['createdAt', 'DESC']],
//                     limit: 1
//                 },
//                 {
//                     model: Course,
//                     attributes: ['examFees', 'courseFees']
//                 }
//             ]
//         });

//         if (!enrollment) {
//             return res.status(404).json({ message: "Enrollment not found" });
//         }

//         if (!enrollment.course) {
//             console.error('Failed to retrieve course details:', enrollment);
//             return res.status(404).json({ message: "Course details not found for the enrollment" });
//         }

//         const { examFees, courseFees } = enrollment.course;
//         const initialBalance = examFees + courseFees; // Total amount due
//         const lastPayment = enrollment.payments[0]; // Assuming the first item is the most recent payment
//         const currentBalance = lastPayment ? lastPayment.balance : initialBalance;

//         if (currentBalance <= 0) {
//             return res.status(400).json({ message: "All payments have already been completed for this enrollment." });
//         }

//         if (amount > currentBalance) {
//             return res.status(400).json({ message: "Payment exceeds the remaining balance. No further payment required." });
//         }

//         const newBalance = currentBalance - amount;
//         const paymentDate = new Date();

//         // Create the payment record
//         const payment = await Payments.create({
//             enrollmentId,
//             amount,
//             paymentDate,
//             paymentMethod,
//             balance: newBalance,
//             createdBy,
//             createdByName
//         });

//         // Update Fees table's balanceAmount
//         const feeRecord = await Fees.findOne({
//             where: { enrollmentId },
//         });

//         if (!feeRecord) {
//             console.error('Fees record not found for enrollment:', enrollmentId);
//             return res.status(404).json({ message: "Fees record not found for the enrollment" });
//         }

//         const updatedBalanceAmount = feeRecord.balanceAmount - amount;

//         await Fees.update({ balanceAmount: updatedBalanceAmount }, {
//             where: { enrollmentId },
//             returning: true
//         });

//         res.status(201).json({ message: "Payment created successfully", payment });
//     } catch (error) {
//         console.error("Error creating payment:", error);
//         res.status(500).json({ message: "Failed to create payment due to an internal error", error: error.message });
//     }
// };


exports.createPayment = async (req, res) => {
    try {
        const { enrollmentId, amount, paymentMethod ,notes} = req.body;
        const createdBy = req.user.uuid;
        const createdByName = req.user.name;

        // Retrieve the enrollment details
        const enrollment = await Enrollment.findByPk(enrollmentId, {
            include: [
                {
                    model: Course,
                    attributes: ['examFees', 'courseFees']
                }
            ]
        });

        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }

        if (!enrollment.course) {
            console.error('Failed to retrieve course details:', enrollment);
            return res.status(404).json({ message: "Course details not found for the enrollment" });
        }

        // Retrieve Fees record
        const feeRecord = await Fees.findOne({ where: { enrollmentId } });
        if (!feeRecord) {
            console.error('Fees record not found for enrollment:', enrollmentId);
            return res.status(404).json({ message: "Fees record not found for the enrollment" });
        }

        const currentBalance = feeRecord.balanceAmount;

        if (currentBalance <= 0) {
            return res.status(400).json({ message: "All payments have already been completed for this enrollment." });
        }

        if (amount > currentBalance) {
            return res.status(400).json({ message: "Payment exceeds the remaining balance. No further payment required." });
        }

        const newBalance = currentBalance - amount;
        const paymentDate = new Date();

        // Create the payment record
        const payment = await Payments.create({
            enrollmentId,
            amount,
            notes,
            paymentDate,
            paymentMethod,
            balance: newBalance,
            createdBy,
            createdByName
        });

        // Update Fees table's balanceAmount
        await Fees.update({ balanceAmount: newBalance }, {
            where: { enrollmentId },
            returning: true
        });

        res.status(201).json({ message: "Payment created successfully", payment });
    } catch (error) {
        console.error("Error creating payment:", error);
        res.status(500).json({ message: "Failed to create payment due to an internal error", error: error.message });
    }
};

exports.createPaymentEnrollment = async (req, res, parentTransaction = null) => {
    const transaction = parentTransaction || await db.transaction();
    console.log(`Creating payment for enrollmentId: ${req.body.enrollmentId}`);
    console.log(req.body);

    try {
        const { enrollmentId, amount, paymentMethod, notes } = req.body;
        const createdBy = req.user.uuid;
        const createdByName = req.user.name;

        // Retrieve the enrollment details
        const enrollment = await Enrollment.findByPk(enrollmentId, {
            include: [
                {
                    model: Course,
                    attributes: ['examFees', 'courseFees']
                }
            ],
            transaction
        });

        if (!enrollment) {
            throw new Error("Enrollment not found");
        }

        if (!enrollment.course) {
            console.error('Failed to retrieve course details:', enrollment);
            throw new Error("Course details not found for the enrollment");
        }

        // Retrieve Fees record
        const feeRecord = await Fees.findOne({ where: { enrollmentId }, transaction });
        if (!feeRecord) {
            console.error('Fees record not found for enrollment:', enrollmentId);
            throw new Error("Fees record not found for the enrollment");
        }

        const currentBalance = feeRecord.balanceAmount;

        if (currentBalance <= 0) {
            throw new Error("All payments have already been completed for this enrollment.");
        }

        if (amount > currentBalance) {
            throw new Error("Payment exceeds the remaining balance. No further payment required.");
        }

        const newBalance = currentBalance - amount;
        const paymentDate = new Date();

        // Create the payment record
        const payment = await Payments.create({
            enrollmentId,
            amount,
            notes,
            paymentDate,
            paymentMethod,
            balance: newBalance,
            createdBy,
            createdByName
        }, { transaction });

        // Update Fees table's balanceAmount
        await Fees.update({ balanceAmount: newBalance }, {
            where: { enrollmentId },
            returning: true,
            transaction
        });

        if (!parentTransaction) await transaction.commit();
        res.status(201).json({ message: "Payment created successfully", payment });
    } catch (error) {
        console.error(`Error in createPayment: ${error.message}`); // Debugging line

        try {
            if (!parentTransaction) await transaction.rollback();
        } catch (rollbackError) {
            console.error(`Error rolling back transaction in createPayment: ${rollbackError.message}`);
        }

        console.error("Error creating payment:", error);
        res.status(500).json({ message: "Failed to create payment due to an internal error", error: error.message });
    }
};






exports.setFeesForEnrollment = async (enrollmentId, discount) => {
    try {
        // Fetch the enrollment record
        const enrollment = await Enrollment.findOne({ where: { enrollmentId } });

        if (!enrollment) {
            throw new Error('Enrollment not found');
        }

        // Fetch the associated course
        const course = await Course.findOne({ where: { courseId: enrollment.courseId } });

        if (!course) {
            throw new Error('Course not found');
        }

        // Calculate totalFees based on courseFees and examFees
        const totalFees = course.courseFees + course.examFees;

        // Calculate applicableFees based on discount
        const applicableFees = totalFees - discount;

        // Fetch the Fees record associated with the enrollment
        let feesRecord = await Fees.findOne({ where: { enrollmentId } });

        // If no Fees record exists, create a new one
        if (!feesRecord) {
            feesRecord = await Fees.create({
                enrollmentId,
                totalFees,
                discount,
                applicableFees,
                balanceAmount:applicableFees
            });
        } else {
            // Update the existing Fees record
            await feesRecord.update({ totalFees, discount, applicableFees });
        }

        console.log(`Fees updated for enrollmentId: ${enrollmentId}`);
    } catch (error) {
        console.error('Error setting fees for enrollment:', error);
        throw error; // Rethrow the error to handle it in the caller function or route
    }
};

exports.checkIfDiscountGiven = async (enrollmentId) => {
    try {
        // Fetch the Fees record associated with the enrollment
        const feesRecord = await Fees.findOne({ where: { enrollmentId } });

        // If Fees record exists and discount column is filled, return false
        if (feesRecord && feesRecord.discount > 0) {
            return false;
        }

        // If no Fees record exists or discount column is not filled, return true
        return true;
    } catch (error) {
        console.error('Error checking if discount is given for enrollment:', error);
        throw error; // Rethrow the error to handle it in the caller function or route
    }
};

// Update a payment
// exports.updatePayment = async (req, res) => {
//     const { paymentId } = req.params;
//     const { amount, paymentDate, paymentMethod, balance,newBalanceAmount } = req.body;

//     try {
//         const payment = await Payments.findByPk(paymentId);
//         if (!payment) {
//             return res.status(404).json({ message: "Payment not found" });
//         }

//         if (!req.user.role.includes('admin') && payment.createdBy !== req.user.uuid) {
//             return res.status(403).json({ message: "Forbidden: You are not authorized to update this payment" });
//         }

//         await payment.update({
//             amount,
//             paymentDate,
//             paymentMethod,
//             balance:newBalanceAmount
//         });

//         res.status(200).json({ message: "Payment updated successfully", payment });
//     } catch (error) {
//         console.error("Error updating payment:", error);
//         res.status(500).json({ message: "Failed to update payment", error: error.message });
//     }
// };

exports.updatePayment = async (req, res) => {
    const { paymentId } = req.params;
    const { amount, paymentDate, paymentMethod } = req.body;

    try {
        // Find the payment by ID
        const payment = await Payments.findByPk(paymentId);
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        // Check if the user is authorized to update the payment
        if (!req.user.role.includes('admin') && payment.createdBy !== req.user.uuid) {
            return res.status(403).json({ message: "Forbidden: You are not authorized to update this payment" });
        }

        // Calculate the difference in payment amounts
        const paymentDifference = amount - payment.amount;

        // Find the associated Fees record
        const feeRecord = await Fees.findOne({ where: { enrollmentId: payment.enrollmentId } });
        if (!feeRecord) {
            return res.status(404).json({ message: "Fees record not found for the enrollment" });
        }

        // Calculate the new balance
        const newBalanceAmount = feeRecord.balanceAmount - paymentDifference;

        // Update the payment details
        await payment.update({
            amount,
            paymentDate,
            paymentMethod,
            balance: newBalanceAmount // Updating the balance in the Payments model (if necessary)
        });

        // Update the Fees record's balanceAmount
        await Fees.update({ balanceAmount: newBalanceAmount }, {
            where: { enrollmentId: payment.enrollmentId }
        });

        res.status(200).json({ message: "Payment updated successfully", payment });
    } catch (error) {
        console.error("Error updating payment:", error);
        res.status(500).json({ message: "Failed to update payment", error: error.message });
    }
};


// Delete a payment
exports.deletePayment = async (req, res) => {
    const { paymentId } = req.params;

    try {
        const payment = await Payments.findByPk(paymentId);
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        if (!req.user.role.includes('admin') && payment.createdBy !== req.user.uuid) {
            return res.status(403).json({ message: "Forbidden: You are not authorized to delete this payment" });
        }

        await payment.destroy();
        res.status(200).json({ message: "Payment deleted successfully" });
    } catch (error) {
        console.error("Error deleting payment:", error);
        res.status(500).json({ message: "Failed to delete payment", error: error.message });
    }
};

// Get all payments
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payments.findAll({
            include: [
                {
                    model: Enrollment,
                    include: [
                        {
                            model: Course,
                            attributes: ['courseId', 'name','status'],
                        },
                        {
                            model: Student,
                            attributes: ['firstName', 'middleName', 'lastName'], // Include middleName in the attributes list
                        }
                    ]
                }
            ],
            where: req.user.role.includes('admin') ? {} : { '$Enrollment.createdBy$': req.user.uuid }
        });

        // Map each payment to include student and course details if available
        const result = payments.map(payment => {
            // Start with the basic payment information
            const paymentDetails = payment.toJSON();

            // Add full student name if available, including middle name
            if (payment.Enrollment && payment.Enrollment.Student) {
                const { firstName, middleName, lastName } = payment.Enrollment.Student;
                paymentDetails.studentName = `${firstName}${middleName ? ` ${middleName}` : ''} ${lastName}`;
            }

            // Add course name and ID if available
            if (payment.Enrollment && payment.Enrollment.Course) {
                paymentDetails.courseName = payment.Enrollment.Course.name;
                paymentDetails.courseId = payment.Enrollment.Course.courseId;
            }

            return paymentDetails;
        });

        res.status(200).json(result);
    } catch (error) {
        console.error("Error retrieving payments:", error);
        res.status(500).json({ message: "Failed to retrieve payments", error: error.message });
    }
};






// Controller function to get dashboard financial data
// exports.getDashboardFinancials = async (req, res) => {
//     try {
//         let totalReceivedByUser;
//         let totalReceivedAll;
//         let totalBalance = 0;
//         let totalBalanceByUser = 0;

//         // Calculate total received payments for enrollments created by the specific user
         
//             totalReceivedByUser = await Payments.sum('amount', { where: { createdBy: req.user.uuid } });
//             console.log(`Total received payments for enrollments created by user ${req.user.username}:`, totalReceivedByUser);
        

//         // Calculate total received payments for all enrollments
//         totalReceivedAll = await Payments.sum('amount');
//         console.log(`Total received payments for all enrollments:`, totalReceivedAll);

//         // Fetch all payments
//         const allPayments = await Payments.findAll({ order: [['createdAt', 'DESC']] });

//         // Object to store the latest payment for each enrollment
//         const latestPayments = {};

//         // Iterate through payments to find the latest payment for each enrollment
//         allPayments.forEach(payment => {
//             if (!latestPayments[payment.enrollmentId] || payment.createdAt > latestPayments[payment.enrollmentId].createdAt) {
//                 latestPayments[payment.enrollmentId] = payment;
//             }
//         });

//         // Calculate total balance based on the latest payments
//         for (const enrollmentId in latestPayments) {
//             const latestPayment = latestPayments[enrollmentId];
//             totalBalance += parseFloat(latestPayment.balance); // Parse as number
//             if (latestPayment.createdBy === req.user.uuid) {
//                 totalBalanceByUser += parseFloat(latestPayment.balance);
//             }
//         }

//         console.log(`Total balance of all enrollments:`, totalBalance);

//         // Prepare the response based on user role
//         let responseObject = {
//             totalReceivedAll,
//             totalBalance: totalBalance.toFixed(2), // Convert to string with 2 decimal places
//             isAdmin: req.user.role === 'admin' // Add isAdmin field to the response
//         };

//         if (req.user.role === 'admin') {
//             responseObject.totalReceivedByUser = totalReceivedByUser;
//             responseObject.totalBalanceByUser = totalBalanceByUser.toFixed(2);
//         } else {
//             responseObject.totalReceivedByUser = totalReceivedByUser;
//             responseObject.totalBalanceByUser = totalBalanceByUser.toFixed(2);
//         }

//         res.status(200).json(responseObject);
//     } catch (error) {
//         console.error("Error retrieving dashboard financial data:", error);
//         res.status(500).json({ message: "Failed to retrieve financial data", error: error.message });
//     }
// };

//const { Payments, Enrollment } = require('../models'); // Adjust the path as necessary


exports.getDashboardFinancials = async (req, res) => {
    try {
        let totalReceivedByUser;
        let totalReceivedAll;
        let totalBalance = 0;
        let totalBalanceByUser = 0;

        // Calculate total received payments for enrollments created by the specific user
        totalReceivedByUser = await Payments.sum('amount', { where: { createdBy: req.user.uuid } });
        console.log(`Total received payments for enrollments created by user ${req.user.username}:`, totalReceivedByUser);

        // Calculate total received payments for all enrollments
        totalReceivedAll = await Payments.sum('amount');
        console.log(`Total received payments for all enrollments:`, totalReceivedAll);

        // Fetch all payments with associated enrollments (excluding dropped enrollments)
        const allPayments = await Payments.findAll({
            include: [{
                model: Enrollment,
                where: { status: { [Sequelize.Op.not]: 'dropped' } },
                include: [Student] // Include Student model if needed for further details
            }],
            order: [['createdAt', 'DESC']]
        });

        console.log("All payments:", allPayments);

        // Object to store the latest payment for each enrollment
        const latestPayments = {};

        // Iterate through payments to find the latest payment for each enrollment
        allPayments.forEach(payment => {
            if (!latestPayments[payment.enrollmentId] || payment.createdAt > latestPayments[payment.enrollmentId].createdAt) {
                latestPayments[payment.enrollmentId] = payment;
            }
        });

        console.log("Latest payments:", latestPayments);

        // Calculate total balance based on the latest payments (excluding dropped enrollments)
        for (const enrollmentId in latestPayments) {
            const latestPayment = latestPayments[enrollmentId];
            if (latestPayment.enrollment && latestPayment.enrollment.status !== 'dropped') {
                totalBalance += parseFloat(latestPayment.balance); // Parse as number
                if (latestPayment.createdBy === req.user.uuid) {
                    totalBalanceByUser += parseFloat(latestPayment.balance);
                }
            }
        }

        console.log(`Total balance of all enrollments:`, totalBalance);

        // Prepare the response based on user role
        let responseObject = {
            totalReceivedAll,
            totalBalance: totalBalance.toFixed(2), // Convert to string with 2 decimal places
            isAdmin: req.user.role === 'admin' // Add isAdmin field to the response
        };

        if (req.user.role === 'admin') {
            responseObject.totalReceivedByUser = totalReceivedByUser;
            responseObject.totalBalanceByUser = totalBalanceByUser.toFixed(2);
        } else {
            responseObject.totalReceivedByUser = totalReceivedByUser;
            responseObject.totalBalanceByUser = totalBalanceByUser.toFixed(2);
        }

        res.status(200).json(responseObject);
    } catch (error) {
        console.error("Error retrieving dashboard financial data:", error);
        res.status(500).json({ message: "Failed to retrieve financial data", error: error.message });
    }
};


// const { Sequelize } = require('sequelize');
// const db = require('../config/Database.js');
// const Payments = require('./PaymentModel.js');
// const Student = require('./StudentModel.js');
// const Enrollment = require('./EnrollmentModel.js'); // Assuming you've imported Enrollment model
//const { Payments, Enrollment, Course, Student } = require('../models');
exports.getPaymentById = async (req, res) => {
    const { paymentId } = req.params;

    try {
        const payment = await Payments.findByPk(paymentId, {
            include: [
            {
                    model: Enrollment,
                    include: [
                        { model: Course, attributes: ['name'] },
                        { model: Student, attributes: ['firstName', 'middleName', 'lastName',`addressLine1`,'addressLine2','city','taluka','district','state','pincode'] }
                    ]
                }
            ]
        });

        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        // Example authorization check (if needed)
        if (!req.user.role.includes('admin') && payment.createdBy !== req.user.uuid) {
            return res.status(403).json({ message: "Forbidden: You are not authorized to view this payment" });
        }

        // Extracting relevant data
        const { enrollmentId, amount, paymentDate, paymentMethod, balance, createdBy, createdByName, createdAt, updatedAt } = payment;

        // Extracting course and student details
        let courseName = null;
        let studentName = null;
        let address = null;

        if (payment.enrollment && payment.enrollment.course) {
            courseName = payment.enrollment.course.name;
        }

        if (payment.enrollment && payment.enrollment.student) {
            const student = payment.enrollment.student;
            studentName = `${student.firstName} ${student.middleName ? student.middleName + ' ' : ''}${student.lastName}`;
            address = `${student.addressLine1 || ''}, ${student.addressLine2 || ''}, ${student.city || ''},   PIN-${student.pincode || ''}, TAL-${student.taluka || ''}, DIST- ${student.district || ''},${student.state || ''}, ${student.country || ''}`.replace(/, ,/g, ',').replace(/, $/, '');
        }

        // Constructing response object
        const response = {
            paymentId,
            enrollmentId,
            amount,
            paymentDate,
            paymentMethod,
            balance,
            createdBy,
            createdByName,
            createdAt,
            updatedAt,
            courseName,
            studentName,
            address
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Error retrieving payment:", error);
        res.status(500).json({ message: "Failed to retrieve payment", error: error.message });
    }
};



// Get a single payment by ID  13/7/2024
// exports.getPaymentById = async (req, res) => {
//     const { paymentId } = req.params;

//     try {
//         const payment = await Payments.findByPk(paymentId);
        
//         if (!payment) {
//             return res.status(404).json({ message: "Payment not found" });
//         }

//         if (!req.user.role.includes('admin') && payment.createdBy !== req.user.uuid) {
//             return res.status(403).json({ message: "Forbidden: You are not authorized to view this payment" });
//         }

//         res.status(200).json(payment);
//     } catch (error) {
//         console.error("Error retrieving payment:", error);
//         res.status(500).json({ message: "Failed to retrieve payment", error: error.message });
//     }
// };

// exports.getPaymentById = async (req, res) => {
//     const { paymentId } = req.params;

//     try {
//         const payment = await Payments.findByPk(paymentId);
        
//         if (!payment) {
//             return res.status(404).json({ message: "Payment not found" });
//         }

//         if (!req.user.role.includes('admin') && payment.createdBy !== req.user.uuid) {
//             return res.status(403).json({ message: "Forbidden: You are not authorized to view this payment" });
//         }

//         // Fetch enrollment details for the given enrollmentId
//         const enrollmentResponse = await fetch(`http://localhost:5000/enroll/${payment.enrollmentId}`, {
//             method: 'GET'
//         });

//         // if (!enrollmentResponse.ok) {
//         //     throw new Error(`Failed to fetch enrollment details: ${enrollmentResponse.statusText}`);
//         // }

//         const enrollment = await enrollmentResponse.json();

//         // Construct the response including payment, course, and student details
//         const response = {
//             paymentId: payment.paymentId,
//             enrollmentId: payment.enrollmentId,
//             amount: payment.amount,
//             paymentDate: payment.paymentDate,
//             paymentMethod: payment.paymentMethod,
//             balance: payment.balance,
//             createdBy: payment.createdBy,
//             createdByName: payment.createdByName,
//             createdAt: payment.createdAt,
//             updatedAt: payment.updatedAt,
//             courseId: enrollment.courseId,
//             courseName: enrollment.course,
//             studentName: `${enrollment.student.firstName} ${enrollment.student.middleName} ${enrollment.student.lastName}`,
//             studentAddress: `${enrollment.student.address}, ${enrollment.student.city} ${enrollment.student.pincode} ${enrollment.student.state}`
//         };

//         res.status(200).json(response);
//     } catch (error) {
//         console.error("Error retrieving payment:", error);
//         res.status(500).json({ message: "Failed to retrieve payment details", error: error.message });
//     }
// };

//--------Before---------------------------------------------
//-----------------------------
// exports.getBalanceByEnrollmentId = async (req, res) => {
//     const { enrollmentId } = req.params;

//     try {
//         const enrollment = await Enrollment.findByPk(enrollmentId, {
//             include: [
//                 {
//                     model: Payments,
//                     attributes: ['balance'],
//                     order: [['createdAt', 'DESC']],
//                     limit: 1
//                 },
//                 {
//                     model: Course,
//                     attributes: ['examFees', 'courseFees']
//                 }
//             ]
//         });

//         if (!enrollment) {
//             return res.status(404).json({ message: "Enrollment not found" });
//         }

//         if (!enrollment.course) {
//             console.error('Failed to retrieve course details:', enrollment);
//             return res.status(404).json({ message: "Course details not found for the enrollment" });
//         }

//         const { examFees, courseFees } = enrollment.course;
//         const totalFees = examFees + courseFees; // Sum of exam and course fees as the total fee amount due

//         // Check if there is any payment record; if yes, use the latest balance; if no, use total fees as the balance
//         const lastPayment = enrollment.payments[0]; // Assuming the first item is the most recent payment
//         const currentBalance = lastPayment ? lastPayment.balance : totalFees;

//         res.status(200).json({
//             enrollmentId: enrollment.id,
//             currentBalance: currentBalance,
//             message: "Current balance retrieved successfully"
//         });
//     } catch (error) {
//         console.error("Error retrieving current balance:", error);
//         res.status(500).json({ message: "Failed to retrieve current balance", error: error.message });
//     }
// };


//--------After---------------------------------------------
//-----------------------------

exports.getBalanceByEnrollmentId = async (req, res) => {
    const { enrollmentId } = req.params;

    try {
        const enrollment = await Enrollment.findByPk(enrollmentId, {
            include: [
                {
                    model: Fees,
                    attributes: ['balanceAmount', 'applicableFees'],
                },
                {
                    model: Course,
                    attributes: ['examFees', 'courseFees']
                }
            ]
        });

        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }

        if (!enrollment.fee) {
            console.error('Failed to retrieve fees details:', enrollment);
            return res.status(404).json({ message: "Fees details not found for the enrollment" });
        }

        const { balanceAmount, applicableFees } = enrollment.fee;

        res.status(200).json({
            enrollmentId: enrollment.enrollmentId, // Ensure this matches your data model's property names
            currentBalance: balanceAmount,
            applicableFees: applicableFees,
            message: "Current balance retrieved successfully"
        });
    } catch (error) {
        console.error("Error retrieving current balance:", error);
        res.status(500).json({ message: "Failed to retrieve current balance", error: error.message });
    }
};

exports.getMyPayments = async (req, res) => {
    try {
        // Extract email of the current user
        const userEmail = req.user.email;

        // Find the student corresponding to the email in the Student model
        const student = await Student.findOne({ where: { email: userEmail } });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Query the database for enrollments based on the retrieved studentId
        const enrollments = await Enrollment.findAll({
            where: { studentId: student.studentId },
            attributes: ['enrollmentId'] // Only fetch the enrollmentId
        });

        // Extract the enrollment IDs
        const enrollmentIds = enrollments.map(enrollment => enrollment.enrollmentId);

        // Fetch payments for these enrollments
        const payments = await Payments.findAll({
            where: { enrollmentId: enrollmentIds },
            include: [
                {
                    model: Enrollment,
                    include: [
                        {
                            model: Course,
                            attributes: ['courseId', 'name', 'status'],
                        },
                        {
                            model: Student,
                            attributes: ['firstName', 'middleName', 'lastName'],
                        }
                    ]
                }
            ]
        });

        // Map each payment to include student and course details if available
        const result = payments.map(payment => {
            const paymentDetails = payment.toJSON();

            // Add full student name if available
            if (payment.Enrollment && payment.Enrollment.Student) {
                const { firstName, middleName, lastName } = payment.Enrollment.Student;
                paymentDetails.studentName = `${firstName}${middleName ? ` ${middleName}` : ''} ${lastName}`;
            }

            // Add course name and ID if available
            if (payment.Enrollment && payment.Enrollment.Course) {
                paymentDetails.courseName = payment.Enrollment.Course.name;
                paymentDetails.courseId = payment.Enrollment.Course.courseId;
            }

            return paymentDetails;
        });

        res.status(200).json(result);
    } catch (error) {
        console.error("Error retrieving payments:", error);
        res.status(500).json({ message: "Failed to retrieve payments", error: error.message });
    }
};
