const express = require("express");
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/Courses.js");
const { verifyUser } = require("../middleware/AuthUser.js");
const {
  uploadStudyMaterial,
  getStudyMaterialsByCourse,
  deleteStudyMaterial,
  showStudyMaterial,
  updateStudyMaterial,
  getStudyMaterialById
} = require('../controllers/StudyMaterialController.js');

// Routes for courses
router.get("/courses", verifyUser, getCourses);
router.get("/courses/:id", verifyUser, getCourseById);
router.post("/courses", verifyUser, createCourse);
router.patch("/courses/:id", verifyUser, updateCourse);
router.delete("/courses/:id", verifyUser, deleteCourse);

// Routes for study materials
router.post('/materials', verifyUser, uploadStudyMaterial);
router.patch('/materials/:materialId', verifyUser, updateStudyMaterial);
router.get('/materials/:courseId', verifyUser, getStudyMaterialsByCourse);
router.get('/materials/show/:materialId', verifyUser, showStudyMaterial);
router.get('/materials/doc/:materialId', verifyUser, getStudyMaterialById);
router.delete('/materials/:materialId', verifyUser, deleteStudyMaterial);

module.exports = router;
