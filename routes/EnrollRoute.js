
const express = require('express');
const {createAndSetFees, createEnrollment, updateEnrollment, deleteEnrollment, getAllEnrollments, getEnrollmentById, getTotalEnrollments, getMyEnrollments ,getEnrollmentsByStudentId} = require("../controllers/EnrollmentController.js");
const { verifyUser } = require("../middleware/AuthUser.js");

const router = express.Router();

router.get("/enroll", verifyUser, getAllEnrollments);
router.get("/enroll/:enrollmentId", verifyUser, getEnrollmentById);
// router.post("/enroll", verifyUser, createEnrollment);
router.post("/enroll", verifyUser, createAndSetFees);

router.patch("/enroll/:enrollmentId", verifyUser, updateEnrollment);
router.delete("/enroll/:enrollmentId", verifyUser, deleteEnrollment);
router.get("/totalenrollments", verifyUser, getTotalEnrollments);
router.get("/myenrollments", verifyUser, getMyEnrollments);
router.get("/getenrollment/:studentId", verifyUser, getEnrollmentsByStudentId);


module.exports = router;
