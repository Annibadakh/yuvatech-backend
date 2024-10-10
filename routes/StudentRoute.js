const express = require('express');
const { createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent ,getStudentMe,updateStudentProfile} = require('../controllers/StudentController.js');
const { verifyUser, adminOnly } = require('../middleware/AuthUser.js');
const path = require('path'); // Import the 'path' module properly

const { updateStudentImage, uploadStudentImage, getStudentPhoto, getStudentIdentityImage, deleteStudentImage, downloadImage, } = require('../controllers/ImageController.js');

const router = express.Router();

// Create a new student (accessible to admins only)
router.post('/students', verifyUser, createStudent);

// Get all students (accessible to admins only)
router.get('/students', verifyUser, getAllStudents);

// Get a specific student by ID (accessible to admins only)
router.get('/students/:id', verifyUser, getStudentById);
router.get('/profile', verifyUser, getStudentMe);
router.patch('/profile', verifyUser, updateStudentProfile);


// Update a student by ID (accessible to admins only)
router.patch('/students/:id', verifyUser, updateStudent);

// Delete a student by ID (accessible to admins only)
router.delete('/students/:id', verifyUser, deleteStudent);

router.post('/student/image/:studentId', verifyUser, uploadStudentImage);
router.patch('/student/image/:studentId', verifyUser, updateStudentImage);
router.get('/student/image/:studentId', verifyUser, getStudentPhoto);
router.get('/student/imageidentity/:studentId', verifyUser, getStudentIdentityImage);
router.get('/student/images/:studentId/:imageType', verifyUser, downloadImage);
router.delete('/student/image/:studentId', verifyUser, deleteStudentImage);

module.exports = router;

