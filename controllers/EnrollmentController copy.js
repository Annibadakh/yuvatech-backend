
// const db = require('../config/Database.js');

const Enrollments = require('../models/EnrollmentModel.js');
const Students = require('../models/StudentModel.js');
const Courses = require('../models/CourseModel.js');
const Payments = require('../models/PaymentModel.js');
const User = require('../models/UserModel.js');
const Fees = require('../models/Fees.js');


const argon2 = require('argon2');

// // const { Students, Enrollments, User, Course, Fees } = require('./models'); // Adjust import based on your setup

// exports.createAndSetFees = async (req, res) => {
//     const transaction = await db.transaction(); // Use db.transaction() for transaction

//     try {
//         const { studentId, courseId, discount } = req.body;
//         const createdBy = req.user.uuid;
//         const createdByName = req.user.name;
//         const enrollmentDate = new Date();

//         if (!['user', 'admin'].includes(req.user.role)) {
//             return res.status(403).json({ message: "Forbidden: Only users with role 'user' or 'admin' can create enrollments" });
//         }

//         // Fetch student details
//         const student = await Students.findByPk(studentId, { transaction });
//         if (!student) {
//             throw new Error('Student not found');
//         }

//         const name = `${student.firstName} ${student.middleName} ${student.lastName}`;
//         let existingUser = await User.findOne({ where: { email: student.email }, transaction });

//         if (!existingUser) {
//             const defaultPassword = `${student.firstName}@${Math.floor(100 + Math.random() * 900)}`;
//             const userEmail = student.email;
//             const hashedPassword = await argon2.hash(defaultPassword);

//             existingUser = await User.create({
//                 name,
//                 email: userEmail,
//                 password: hashedPassword,
//                 role: 'student',
//                 createdBy,
//                 copyofpassword: defaultPassword
//             }, { transaction });
//         }

//         // Create Enrollment
//         const enrollment = await Enrollments.create({
//             studentId,
//             courseId,
//             enrollmentDate,
//             createdBy,
//             createdByName
//         }, { transaction });

//         console.log('Created Enrollment ID:', enrollment.enrollmentId); // Debugging line

//         // Fetch course details
//         const course = await Courses.findByPk(courseId, { transaction });
//         if (!course) {
//             throw new Error('Course not found');
//         }

//         const totalFees = course.courseFees + course.examFees;
//         const applicableFees = totalFees - discount;

//         // Check if Fees record exists
//         let feesRecord = await Fees.findOne({ where: { enrollmentId: enrollment.enrollmentId }, transaction });
//         if (!feesRecord) {
//             feesRecord = await Fees.create({
//                 enrollmentId: enrollment.enrollmentId,
//                 totalFees,
//                 discount,
//                 applicableFees,
//                 balanceAmount: applicableFees
//             }, { transaction });
//         } else {
//             await feesRecord.update({ totalFees, discount, applicableFees }, { transaction });
//         }

//         await transaction.commit(); // Commit the transaction
//         res.status(201).json({ message: 'Enrollment and fees set successfully', enrollment });
//     } catch (error) {
//         await transaction.rollback(); // Rollback the transaction in case of error
//         console.error('Error creating enrollment and setting fees:', error);
//         res.status(500).json({ message: 'Failed to create enrollment and set fees', error: error.message });
//     }
// };

const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");

const { createPaymentEnrollment } = require("./PaymentController.js"); // Import the createPayment function
// const { createPayment } = require("./PaymentController.js"); // Import the createPayment function


exports.createAndSetFees = async (req, res) => {
    const transaction = await db.transaction(); // Start a transaction

    try {
        const { studentId, courseId, discount, paymentDetails} = req.body;
        const createdBy = req.user.uuid;
        const createdByName = req.user.name;
        const enrollmentDate = new Date();

        // Check user role
        if (!['user', 'admin'].includes(req.user.role)) {
            if (!res.headersSent) {
                return res.status(403).json({ message: "Forbidden: Only users with role 'user' or 'admin' can create enrollments" });
            }
        }

        // Fetch student details
        const student = await Students.findByPk(studentId, { transaction });
        if (!student) {
            throw new Error('Student not found');
        }

        const name = `${student.firstName} ${student.middleName} ${student.lastName}`;
        let existingUser = await User.findOne({ where: { email: student.email }, transaction });

        if (!existingUser) {
            const defaultPassword = `${student.firstName}@${Math.floor(100 + Math.random() * 900)}`;
            const userEmail = student.email;
            const hashedPassword = await argon2.hash(defaultPassword);

            existingUser = await User.create({
                name,
                email: userEmail,
                password: hashedPassword,
                role: 'student',
                createdBy,
                // copyofpassword: defaultPassword
            }, { transaction });
        }

        // Create Enrollment
        const enrollment = await Enrollments.create({
            studentId,
            courseId,
            enrollmentDate,
            createdBy,
            createdByName
        }, { transaction });

        // Fetch course details
        const course = await Courses.findByPk(courseId, { transaction });
        if (!course) {
            throw new Error('Course not found');
        }

        const totalFees = course.courseFees + course.examFees;
        const applicableFees = totalFees - discount;

        // Check if Fees record exists
        let feesRecord = await Fees.findOne({ where: { enrollmentId: enrollment.enrollmentId }, transaction });
        if (!feesRecord) {
            feesRecord = await Fees.create({
                enrollmentId: enrollment.enrollmentId,
                totalFees,
                discount,
                applicableFees,
                balanceAmount: applicableFees
            }, { transaction });
        } else {
            await feesRecord.update({ totalFees, discount, applicableFees }, { transaction });
        }

        // Prepare response object
        const responsePayload = {
            enrollment,
            feesRecord
        };

        // Call the createPayment method if payment details are provided
        if (paymentDetails) {
            console.log(`Calling create payment for enrollment ID: ${enrollment.enrollmentId}`);

            paymentDetails.enrollmentId = enrollment.enrollmentId;

            // Use the createPayment method to handle payment creation
            const paymentResponse = await createPaymentEnrollment({ body: paymentDetails, user: req.user }, res, transaction); // Pass the transaction as an argument
            responsePayload.payment = paymentResponse; // Add payment response to the payload
        }

        await transaction.commit(); // Commit the transaction

        // Send combined response
        if (!res.headersSent) {
            return res.status(201).json({ message: 'Enrollment, fees, and payment processed successfully', data: responsePayload });
        }
    } catch (error) {
        console.error(`Error in createAndSetFees: ${error.message}`);

        // Rollback the transaction in case of error
        try {
            await transaction.rollback();
        } catch (rollbackError) {
            console.error(`Error rolling back transaction: ${rollbackError.message}`);
        }

        // Send a single response if not already sent
        if (!res.headersSent) {
            return res.status(500).json({ message: 'Failed to create enrollment and set fees', error: error.message });
        }
    }
};






// exports.createAndSetFees = async (req, res) => {
//     const transaction = await db.transaction(); // Start a transaction

//     try {
//         const { studentId, courseId, discount, paymentDetails } = req.body;
//         const createdBy = req.user.uuid;
//         const createdByName = req.user.name;
//         const enrollmentDate = new Date();

//         if (!['user', 'admin'].includes(req.user.role)) {
//             return res.status(403).json({ message: "Forbidden: Only users with role 'user' or 'admin' can create enrollments" });
//         }

//         // Fetch student details
//         const student = await Students.findByPk(studentId, { transaction });
//         if (!student) {
//             throw new Error('Student not found');
//         }

//         const name = `${student.firstName} ${student.middleName} ${student.lastName}`;
//         let existingUser = await User.findOne({ where: { email: student.email }, transaction });

//         if (!existingUser) {
//             const defaultPassword = `${student.firstName}@${Math.floor(100 + Math.random() * 900)}`;
//             const userEmail = student.email;
//             const hashedPassword = await argon2.hash(defaultPassword);

//             existingUser = await User.create({
//                 name,
//                 email: userEmail,
//                 password: hashedPassword,
//                 role: 'student',
//                 createdBy,
//                 copyofpassword: defaultPassword
//             }, { transaction });
//         }

//         // Create Enrollment
//         const enrollment = await Enrollments.create({
//             studentId,
//             courseId,
//             enrollmentDate,
//             createdBy,
//             createdByName
//         }, { transaction });

//         // Fetch course details
//         const course = await Courses.findByPk(courseId, { transaction });
//         if (!course) {
//             throw new Error('Course not found');
//         }

//         const totalFees = course.courseFees + course.examFees;
//         const applicableFees = totalFees - discount;

//         // Check if Fees record exists
//         let feesRecord = await Fees.findOne({ where: { enrollmentId: enrollment.enrollmentId }, transaction });
//         if (!feesRecord) {
//             feesRecord = await Fees.create({
//                 enrollmentId: enrollment.enrollmentId,
//                 totalFees,
//                 discount,
//                 applicableFees,
//                 balanceAmount: applicableFees
//             }, { transaction });
//         } else {
//             await feesRecord.update({ totalFees, discount, applicableFees }, { transaction });
//         }

//         // Call the createPayment method if payment details are provided
//         if (paymentDetails) {
//             // Use the createPayment method to handle payment creation
//             await createPayment(req, res, transaction); // Pass the transaction as an argument
//         }

//         await transaction.commit(); // Commit the transaction
//         res.status(201).json({ message: 'Enrollment and fees set successfully', enrollment });
//     } catch (error) {
//         await transaction.rollback(); // Rollback the transaction in case of error
//         console.error('Error creating enrollment and setting fees:', error);
//         res.status(500).json({ message: 'Failed to create enrollment and set fees', error: error.message });
//     }
// };


exports.createEnrollment = async (req, res) => {
    try {
        const { studentId, courseId } = req.body;
        const createdBy = req.user.uuid;
        const createdByName = req.user.name;
        const enrollmentDate = new Date();

        if (!['user', 'admin'].includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: Only users with role 'user' or 'admin' can create enrollments" });
        }

        // Fetch student details using studentId
        const student = await Students.findByPk(studentId);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Concatenate first name, middle name, and last name into a single name field
        const name = `${student.firstName} ${student.middleName} ${student.lastName}`;

        // Check if user with the same email already exists
        let existingUser = await User.findOne({ where: { email: student.email } });

        if (existingUser) {
            // User already exists, enroll them in the course
            const enrollment = await Enrollments.create({
                studentId,// Use existing user's id for enrollment
                courseId,
                enrollmentDate,
                createdBy,
                createdByName
            });

            console.log("Enrollment created successfully:", enrollment); // Log the enrollment object
            return res.status(201).json({ message: "Enrollment created successfully", enrollment });
        }

        // Automatically create user for the enrolled student
        const defaultPassword = `${student.firstName}@${Math.floor(100 + Math.random() * 900)}`; // firstname of user@yt and 3 random numbers
        const userEmail = student.email; // Assuming this is the email of the student
        const hashedPassword = await argon2.hash(defaultPassword);
        // Create enrollment
        const enrollment = await Enrollments.create({
            studentId,
            courseId,
            enrollmentDate,
            createdBy,
            createdByName
        });

        // Create user for the enrolled student
        existingUser = await User.create({
            name: name,
            email: userEmail,
            password: hashedPassword, // Store plain text password
            role: 'student', // Assuming default role for automatically created users
            createdBy: createdBy,
            // copyofpassword: defaultPassword
        });

        // Store a copy of the original password
        // const copyOfPassword = defaultPassword;

        console.log("Enrollment created successfully:", enrollment); // Log the enrollment object
        res.status(201).json({ message: "Enrollment created successfully", enrollment });
    } catch (error) {
        console.error("Error creating enrollment:", error);
        res.status(500).json({ message: "Failed to create enrollment", error: error.message });
    }
};


// Update an existing enrollment

exports.updateEnrollment = async (req, res) => {
    const { enrollmentId } = req.params;
    const { studentId, courseId, enrollmentDate, status } = req.body;

    try {
        const enrollment = await Enrollments.findByPk(enrollmentId);
        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }

        if (req.user.role !== 'admin' && enrollment.createdBy !== req.user.uuid) {
            return res.status(403).json({ message: "Forbidden: You are not allowed to update this enrollment" });
        }

        await enrollment.update({
            studentId,
            courseId,
            enrollmentDate,
            status
        });

        res.status(200).json({ message: "Enrollment updated successfully", enrollment });
    } catch (error) {
        console.error("Error updating enrollment:", error);
        res.status(500).json({ message: "Failed to update enrollment", error: error.message });
    }
};

// Delete an enrollment
exports.deleteEnrollment = async (req, res) => {
    const { enrollmentId } = req.params;

    try {
        const enrollment = await Enrollments.findByPk(enrollmentId);
        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }

        if (req.user.role !== 'admin' && enrollment.createdBy !== req.user.uuid) {
            return res.status(403).json({ message: "Forbidden: You are not allowed to delete this enrollment" });
        }

        await enrollment.destroy();
        res.status(200).json({ message: "Enrollment deleted successfully" });
    } catch (error) {
        console.error("Error deleting enrollment:", error);
        res.status(500).json({ message: "Failed to delete enrollment", error: error.message });
    }
};



// exports.getAllEnrollments = async (req, res) => {
//     try {
//         let enrollments;
//         const queryOptions = {
//             include: [{
//                 model: Students,
//                 attributes: [
//                     'studentId',
//                     [Sequelize.literal("CONCAT(firstName, ' ', middleName, ' ', lastName)"), 'fullName'], // Concatenate names
//                     'mobile',
//                     'email',
//                     'dob',
//                     'city',
//                     'state',
//                     'pincode',
//                     'occupation',
//                     'address',
//                     'gender'
//                 ]
//             }, 
//             {
//                 model: Courses,
//                 attributes: ['name'],
//                 required: true
//             },
//             {
//                 model: Fees,
//                 attributes: ['applicableFees','balanceAmount'],
//                 required: true
//             }
//         ]
//         };

//         if (req.user.role === 'admin') {
//             enrollments = await Enrollments.findAll(queryOptions);
//         } else {
//             queryOptions.where = { createdBy: req.user.uuid };
//             enrollments = await Enrollments.findAll(queryOptions);
//         }


//         res.status(200).json(enrollments);
//     } catch (error) {
//         console.error("Error retrieving enrollments:", error);
//         res.status(500).json({ message: "Failed to retrieve enrollments", error: error.message });
//     }
// };


exports.getAllEnrollments = async (req, res) => {
    try {
        let enrollments;
        const queryOptions = {
            include: [{
                model: Students,
                attributes: [
                    'studentId',
                    [Sequelize.literal("CONCAT(firstName, ' ', middleName, ' ', lastName)"), 'fullName'], // Concatenate names
                    'mobile',
                    'email',
                    'dob',
                    'city',
                    'state',
                    'pincode',
                    'occupation',
                    'addressLine1',
                    'gender'
                ]
            }, 
            {
                model: Courses,
                attributes: ['name'],
                required: true
            },
            {
                model: Fees,
                attributes: ['applicableFees','balanceAmount'],
                required: true
            }
        ]
        };

        if (req.user.role === 'admin') {
            enrollments = await Enrollments.findAll(queryOptions);
        } else {
            queryOptions.where = { createdBy: req.user.uuid };
            enrollments = await Enrollments.findAll(queryOptions);
        }

        enrollments["manish"] = "Hello"

        res.status(200).json(enrollments);
    } catch (error) {
        console.error("Error retrieving enrollments:", error);
        res.status(500).json({ message: "Failed to retrieve enrollments", error: error.message });
    }
};


exports.getMyEnrollments = async (req, res) => {
    try {
        // Extract email of the current user
        const userEmail = req.user.email;

        // Find the student corresponding to the email in the Student model
        const student = await Students.findOne({ where: { email: userEmail } });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Query the database for enrollments based on the retrieved studentId
        const enrollments = await Enrollments.findAll({
            where: { studentId: student.studentId },
            include: [{
                model: Courses, // Include the Courses table
                attributes: ['courseId', 'name', 'status'] // Select the desired attributes
            }]
        });

        // Send the response with the retrieved enrollments
        res.status(200).json(enrollments);
    } catch (error) {
        console.error("Error retrieving enrollments:", error);
        res.status(500).json({ message: "Failed to retrieve enrollments", error: error.message });
    }
};

exports.getEnrollmentsByStudentId = async (req, res) => {
    try {
        // Extract studentId from the request parameters
        const { studentId } = req.params;

        // Find the student corresponding to the provided studentId in the Student model
        const student = await Students.findByPk(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Query the database for enrollments based on the retrieved studentId
        const enrollments = await Enrollments.findAll({
            where: { studentId },
            include: [{
                model: Courses, // Include the Courses table
                attributes: ['courseId', 'name', 'status'] // Select the desired attributes
            }]
        });

        // Send the response with the retrieved enrollments
        res.status(200).json(enrollments);
    } catch (error) {
        console.error("Error retrieving enrollments:", error);
        res.status(500).json({ message: "Failed to retrieve enrollments", error: error.message });
    }
};



exports.getDashboardFinancials = async (req, res) => {
    try {
        let totalReceivedAdmin;
        let totalReceivedByUser;
        let totalReceivedAll;

        // Calculate total received payments for all enrollments by admins
        totalReceivedAdmin = await Payments.sum('amount');

        // Check if the user is an admin
        const isAdmin = req.user.role === 'admin';

        if (!isAdmin) {
            // Calculate total received payments for enrollments created by the specific user
            totalReceivedByUser = await Payments.sum('amount', { where: { createdBy: req.user.uuid } });
            console.log(`Total received payments for enrollments created by user ${req.user.username}:`, totalReceivedByUser);
        }

        // Calculate total received payments for all enrollments
        totalReceivedAll = await Payments.sum('amount');
        console.log(`Total received payments for all enrollments:`, totalReceivedAll);

        // Calculate the total balance by aggregating over all courses
        const courses = await Course.findAll();
        const totalCosts = courses.reduce((acc, course) => acc + parseFloat(course.cost), 0);
        
        // Now subtract total payments from total costs
        const totalBalance = totalCosts - totalReceivedAdmin;
        console.log(`Total balance for user ${req.user.username}:`, totalBalance);

        res.status(200).json({
            totalReceivedAdmin,
            totalReceivedByUser,
            totalReceivedAll,
            totalBalance,
            isAdmin // Add isAdmin field to the response
        });
    } catch (error) {
        console.error("Error retrieving dashboard financial data:", error);
        res.status(500).json({ message: "Failed to retrieve financial data", error: error.message });
    }
};

exports.getTotalEnrollments = async (req, res) => {
    try {
        let total,totalbyUser;
        if (req.user.role === 'admin') {
            total = await Enrollments.count();
        } 
        {
            totalbyUser = await Enrollments.count({
                where: { createdBy: req.user.uuid }
            });
        }

        res.status(200).json({ total,totalbyUser });
    } catch (error) {
        console.error("Error retrieving total enrollments:", error);
        res.status(500).json({ message: "Failed to retrieve total enrollments", error: error.message });
    }
};



// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++before
// exports.getEnrollmentById = async (req, res) => {
//     try {
//         const enrollment = await Enrollments.findByPk(req.params.enrollmentId, {
//             include: [
//                 {
//                     model: Courses,
//                     as: 'course',
//                     attributes: ['examFees', 'courseFees', 'name']
//                 },
//                 {
//                     model: Students,
//                     as: 'student',
//                     attributes: ['firstName', 'middleName', 'lastName', 'address', 'city', 'pincode', 'state']
//                 }
//             ]
//         });

//         if (enrollment) {
//             const paymentsSum = await Payments.sum('amount', {
//                 where: { enrollmentId: req.params.enrollmentId }
//             }) || 0;

//             let courseData = enrollment.course || { examFees: 0, courseFees: 0 };
//             let balance = courseData.examFees + courseData.courseFees - paymentsSum;
//             balance = balance > 0 ? balance : 0;

//             // Concatenate student names, handling possible null values in middle name
//             let studentName = `${enrollment.student.firstName || ''} ${enrollment.student.middleName || ''} ${enrollment.student.lastName || ''}`.replace(/\s+/g, ' ').trim();

//             let address = `${enrollment.student.address || ''} ${enrollment.student.city || ''} ${enrollment.student.pincode || ''} ${enrollment.student.state || ''}`.replace(/\s+/g, ' ').trim();

//             res.status(200).json({
//                 ...enrollment.toJSON(),
//                 studentName: studentName,
//                 balanceAmount: balance,
//                 address : address
//             });
//         } 
//         else {
//             res.status(404).json({ message: "Enrollment not found" });
//         }
//     } catch (error) {
//         console.error("Error retrieving enrollment details:", error);
//         res.status(500).json({ message: "Failed to retrieve enrollment details", error: error.message });
//     }
// };

//$$$$$$$$$$$$$$$$$$$$$$$$$4  AFTER

exports.getEnrollmentById = async (req, res) => {
    try {
        const enrollment = await Enrollments.findByPk(req.params.enrollmentId, {
            include: [
                {
                    model: Courses,
                    as: 'course',
                    attributes: ['examFees', 'courseFees', 'name']
                },
                {
                    model: Students,
                    as: 'student',
                    attributes: ['firstName', 'middleName', 'lastName',  'city', 'pincode', 'state']
                }
            ]
        });

        if (enrollment) {
            const paymentsSum = await Payments.sum('amount', {
                where: { enrollmentId: req.params.enrollmentId }
            }) || 0;

            const fees = await Fees.findOne({
                where: { enrollmentId: req.params.enrollmentId },
                attributes: ['balanceAmount']
            });

            let balance = fees ? fees.balanceAmount : 0;

            // Concatenate student names, handling possible null values in middle name
            let studentName = `${enrollment.student.firstName || ''} ${enrollment.student.middleName || ''} ${enrollment.student.lastName || ''}`.replace(/\s+/g, ' ').trim();

            let address = `${enrollment.student.addressLine1 || ''} ${enrollment.student.city || ''} ${enrollment.student.pincode || ''} ${enrollment.student.state || ''}`.replace(/\s+/g, ' ').trim();

            res.status(200).json({
                ...enrollment.toJSON(),
                studentName: studentName,
                balanceAmount: balance,
                address: address
            });
        } else {
            res.status(404).json({ message: "Enrollment not found" });
        }
    } catch (error) {
        console.error("Error retrieving enrollment details:", error);
        res.status(500).json({ message: "Failed to retrieve enrollment details", error: error.message });
    }
};




// exports.getEnrollmentById = async (req, res) => {
//     try {
//         const enrollment = await Enrollments.findByPk(req.params.enrollmentId, {
//             include: [
//                 {
//                     model: Courses,
//                     as: 'course',
//                     attributes: ['examFees', 'courseFees', 'name']
//                 },
//                 {
//                     model: Students,
//                     as: 'student',
//                     attributes: ['firstName', 'middleName', 'lastName', 'address', 'city', 'pincode', 'state']
//                 },
//                 {
//                     model: Fees,
//                     attributes: ['balanceAmount'],
//                     required: true
//                 }
//             ]
//         });

//         if (enrollment) {
//             // const paymentsSum = await Payments.sum('amount', {
//             //     where: { enrollmentId: req.params.enrollmentId }
//             // }) || 0;

//             // let courseData = enrollment.course || { examFees: 0, courseFees: 0 };
//             // let balance = courseData.examFees + courseData.courseFees - paymentsSum;
//             // balance = balance > 0 ? balance : 0;

//             // Concatenate student names, handling possible null values in middle name

//             let balance = enrollment.fee.balanceAmount;
//             let studentName = `${enrollment.student.firstName || ''} ${enrollment.student.middleName || ''} ${enrollment.student.lastName || ''}`.replace(/\s+/g, ' ').trim();

//             let address = `${enrollment.student.address || ''} ${enrollment.student.city || ''} ${enrollment.student.pincode || ''} ${enrollment.student.state || ''}`.replace(/\s+/g, ' ').trim();

//             res.status(200).json({
//                 ...enrollment.toJSON(),
//                 studentName: studentName,
//                 balanceAmount: balance,
//                 address : address
//             });
//         } 
//         else {
//             res.status(404).json({ message: "Enrollment not found" });
//         }
//     } catch (error) {
//         console.error("Error retrieving enrollment details:", error);
//         res.status(500).json({ message: "Failed to retrieve enrollment details", error: error.message });
//     }
// };