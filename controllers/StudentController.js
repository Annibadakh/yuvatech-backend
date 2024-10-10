const { Sequelize, DataTypes, Op } = require("sequelize");
const db = require("../config/Database.js");
const Students = require('../models/StudentModel.js');
const User = require('../models/UserModel.js'); // Assuming your User model is exported as User

// Create a new student

exports.createStudent = async (req, res) => {
    try {
        const { firstName, middleName, lastName, mobile,alternatemobile, email, dob, city, state, pincode, occupation, addressLine1,addressLine2,district,taluka,country,courseIds, gender } = req.body;
        const createdBy = req.user.uuid;
        const createdByName = req.user.name;

        if (!['user', 'admin'].includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: Only users with role 'user' or 'admin' can create a student" });
        }

        const existingStudent = await Students.findOne({ where: { email } });
        if (existingStudent) {
            return res.status(409).json({ message: "Student with this email already exists" });
        }

        const student = await Students.create({
            firstName, middleName, lastName, mobile,alternatemobile, email, dob, city, state, pincode, occupation,  gender,courseIds,
            createdBy, createdByName, addressLine1,addressLine2,district,taluka,country
        });
        
        const studentId = student.studentId; // Adjust this according to how your database generates IDs

        res.status(201).json({ message: "Student created successfully", student });
    } catch (error) {
        console.error("Error creating student:", error);
        res.status(500).json({ message: "Failed to create student", error: error.message });
    }
};

// Update an existing student
// exports.updateStudent = async (req, res) => {
//     const { id } = req.params;
//     const { firstName, middleName, lastName, mobile,alternatemobile, email, dob, city, state, pincode, occupation, address, gender,courseIds, identityNo, identityType } = req.body;

//     try {
//         const student = await Students.findByPk(id);
//         if (!student) {
//             return res.status(404).json({ message: "Student not found" });
//         }

//         // Check if the user is authorized to update the student
//         if (req.user.role !== 'admin' && student.createdBy !== req.user.uuid) {
//             return res.status(403).json({ message: "Forbidden: You are not allowed to update this student" });
//         }

//         // Update student details
//         await student.update({ 
//             firstName, 
//             middleName, 
//             lastName, 
//             mobile, alternatemobile,
//             email, 
//             dob, 
//             city, 
//             state, 
//             pincode, 
//             occupation, 
//             courseIds,
//             address, 
//             gender, 
//             identityNo, 
//             identityType 
//         });
        
//         res.status(200).json({ message: "Student updated successfully", student });
//     } catch (error) {
//         console.error("Error updating student:", error);
//         res.status(500).json({ message: "Failed to update student", error: error.message });
//     }
// };

// exports.updateStudent = async (req, res) => {
//     const { id } = req.params;
//     const { firstName, middleName, lastName, mobile, alternatemobile, email, dob, city, state, pincode, occupation, address, gender, courseIds, identityNo, identityType } = req.body;

//     let transaction;
//     try {
//         // Begin a transaction
//         transaction = await db.transaction();

//         // Update student details
//         const student = await Students.findByPk(id);
//         if (!student) {
//             return res.status(404).json({ message: "Student not found" });
//         }

//         // Check if the user is authorized to update the student
//         if (req.user.role !== 'admin' && student.createdBy !== req.user.uuid) {
//             return res.status(403).json({ message: "Forbidden: You are not allowed to update this student" });
//         }

//         await student.update({
//             firstName,
//             middleName,
//             lastName,
//             mobile,
//             alternatemobile,
//             email,
//             dob,
//             city,
//             state,
//             pincode,
//             occupation,
//             address,
//             gender,
//             courseIds,
//             identityNo,
//             identityType
//         }, { transaction });

//         // Update associated user based on email
//         const user = await User.findOne({
//             where: {
//                 email: email
//             },
//             transaction
//         });

//         if (user) {
//             await user.update({
//                 name: `${firstName} ${lastName}`
//                 // Update other fields as needed
//             }, { transaction });
//         }

//         // Commit the transaction
//         await transaction.commit();

//         res.status(200).json({ message: "Student and associated user updated successfully", student });
//     } catch (error) {
//         // Rollback the transaction if there's an error
//         if (transaction) await transaction.rollback();

//         console.error("Error updating student:", error);
//         res.status(500).json({ message: "Failed to update student", error: error.message });
//     }
// };
exports.updateStudent = async (req, res) => {
    const { id } = req.params;
    const { 
        firstName, 
        middleName, 
        lastName, 
        mobile, 
        alternatemobile, 
        email, 
        dob, 
        city, 
        state, 
        pincode, 
        occupation, 
        // address, 
        gender, 
        courseIds, 
        identityNo, 
        identityType ,
        addressLine1,
        addressLine2,
        district,
        taluka,
        country

    } = req.body;

    let transaction;
    try {
        // Begin a transaction
        transaction = await db.transaction();

        // Update student details
        const student = await Students.findByPk(id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Check if the user is authorized to update the student
        if (req.user.role !== 'admin' && student.createdBy !== req.user.uuid) {
            return res.status(403).json({ message: "Forbidden: You are not allowed to update this student" });
        }

        await student.update({
            firstName,
            middleName,
            lastName,
            mobile,
            alternatemobile,
            email,
            dob,
            city,
            state,
            pincode,
            occupation,
            // address,
            gender,
            courseIds,
            identityNo,
            identityType,
            addressLine1,
            addressLine2,
            district,
            taluka,
            country


        }, { transaction });

        // Update associated user based on email if email is provided
        let user;
        if (email) {
            user = await User.findOne({
                where: {
                    email: email
                },
                transaction
            });
        }

        if (user) {
            await user.update({
                name: `${firstName} ${lastName}`
                // Update other fields as needed
            }, { transaction });
        }

        // Commit the transaction
        await transaction.commit();

        res.status(200).json({ message: "Student and associated user updated successfully", student });
    } catch (error) {
        // Rollback the transaction if there's an error
        if (transaction) await transaction.rollback();

        console.error("Error updating student:", error);
        res.status(500).json({ message: "Failed to update student", error: error.message });
    }
};


// Delete a student
exports.deleteStudent = async (req, res) => {
    const { id } = req.params;

    try {
        const student = await Students.findByPk(id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Check if the user is authorized to delete the student
        if (req.user.role !== 'admin' && student.createdBy !== req.user.uuid) {
            return res.status(403).json({ message: "Forbidden: You are not allowed to delete this student" });
        }

        await student.destroy();
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ message: "Failed to delete student", error: error.message });
    }
};


exports.getAllStudents = async (req, res) => {
    try {
        let students;
        if (req.user.role === 'admin') {
            students = await Students.findAll();
        } else {
            students = await Students.findAll({ where: { createdBy: req.user.uuid } });
        }

        // Map through each student to create a new object with all information
        const studentOptions = students.map(student => {
            return {
                id: student.studentId,
                fullName: [student.firstName, student.middleName, student.lastName].filter(Boolean).join(" "),
                firstName: student.firstName,
                middleName: student.middleName,
                lastName: student.lastName,
                mobile: student.mobile,
                email: student.email,
                dob: student.dob,
                city: student.city,
                state: student.state,
                pincode: student.pincode,
                occupation: student.occupation,
                address: student.address,
                gender: student.gender,
                courseIds:student.courseIds,
                createdBy: student.createdBy,
                createdByName: student.createdByName,
                country: student.country,
                district: student.district,
                taluka: student.taluka,
                addressLine1: student.addressLine1,
                addressLine2: student.addressLine2,

               

            };
        });

        res.status(200).json(studentOptions);
    } catch (error) {
        console.error("Error retrieving students:", error);
        res.status(500).json({ message: "Failed to retrieve students", error: error.message });
    }
};


// Get a single student by ID
exports.getStudentById = async (req, res) => {
    const { id } = req.params;

    try {
        const student = await Students.findByPk(id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Check if the user is authorized to view the student
        if (req.user.role !== 'admin' && student.createdBy !== req.user.uuid) {
            return res.status(403).json({ message: "Forbidden: You are not allowed to view this student" });
        }

        res.status(200).json(student);
    } catch (error) {
        console.error("Error retrieving student:", error);
        res.status(500).json({ message: "Failed to retrieve student", error: error.message });
    }
};


// exports.getStudentMe = async (req, res) => {
//     try {
//         // Extract email of the current user
//         const userEmail = req.user.email;

//         // Find the student corresponding to the email in the Student model
//         const student = await Students.findOne({ where: { email: userEmail } });
//         if (!student) {
//             return res.status(404).json({ message: "Student not found" });
//         }

//         // Use the retrieved studentId to get the student details
//         const studentDetails = await Students.findByPk(student.studentId);
//         if (!studentDetails) {
//             return res.status(404).json({ message: "Student details not found" });
//         }

//         // Check if the user is authorized to view their own profile
//         if (student.studentId !== req.user.studentId) {
//             return res.status(403).json({ message: "Forbidden: You are not allowed to view this profile" });
//         }

//         res.status(200).json(studentDetails);
//     } catch (error) {
//         console.error("Error retrieving student details:", error);
//         res.status(500).json({ message: "Failed to retrieve student details", error: error.message });
//     }
// };


exports.getStudentMe = async (req, res) => {
    try {
        // Extract email of the current user
        const userEmail = req.user.email;
        console.log(`Fetching student for email: ${userEmail}`);

        // Find the student corresponding to the email in the Student model
        const student = await Students.findOne({ where: { email: userEmail } });
        if (!student) {
            console.error("Student not found in the database.");
            return res.status(404).json({ message: "Student not found" });
        }

        // Use the retrieved studentId to get the student details
        console.log(`Found studentId: ${student.studentId}, fetching details...`);
        const studentDetails = await Students.findByPk(student.studentId);
        if (!studentDetails) {
            console.error("Student details not found in the database.");
            return res.status(404).json({ message: "Student details not found" });
        }

        // Check if the user is authorized to view their own profile
        // if (student.studentId !== req.user.studentId) {
        //     console.error("Unauthorized access attempt.");
        //     return res.status(403).json({ message: "Forbidden: You are not allowed to view this profile" });
        // }

        res.status(200).json(studentDetails);
    } catch (error) {
        console.error("Error retrieving student details:", error);
        res.status(500).json({ message: "Failed to retrieve student details", error: error.message });
    }
};


exports.updateStudentProfile = async (req, res) => {
    const { 
        firstName, 
        middleName, 
        lastName, 
        mobile, 
        alternatemobile, 
        dob, 
        city, 
        state, 
        pincode, 
        occupation, 
        address, 
        gender ,
        addressLine1,
        addressLine2,
        district,
        taluka,
        country

    } = req.body;

    let transaction;
    try {
        // Begin a transaction
        transaction = await db.transaction();

        // Fetch the logged-in student using their email
        const loggedInStudent = await Students.findOne({ where: { email: req.user.email } });
        if (!loggedInStudent) {
            return res.status(404).json({ message: "Student not found for the logged-in user" });
        }

        // Update the logged-in student's profile with allowed fields
        await loggedInStudent.update({
            firstName,
            middleName,
            lastName,
            mobile,
            alternatemobile,
            dob,
            city,
            state,
            pincode,
            occupation,
            address,
            gender, 
            addressLine1,
            addressLine2,
            district,
            taluka,
            country
            

        }, { transaction });

        // Update associated user based on email if email is provided
        if (req.body.email) {
            const user = await User.findOne({
                where: { email: req.body.email },
                transaction
            });

            if (user) {
                await user.update({
                    name: `${firstName} ${lastName}`
                    // Update other fields as needed
                }, { transaction });
            }
        }

        // Commit the transaction
        await transaction.commit();

        res.status(200).json({ message: "Profile updated successfully", student: loggedInStudent });
    } catch (error) {
        // Rollback the transaction if there's an error
        if (transaction) await transaction.rollback();

        console.error("Error updating student profile:", error);
        res.status(500).json({ message: "Failed to update profile", error: error.message });
    }
};

