
const Courses = require("../models/CourseModel.js");
const User = require("../models/UserModel.js");
const { Op } = require("sequelize");

exports.getCourses = async (req, res) => {
    try {
        console.log('Request received for fetching courses');

        // Ensure user is authenticated
        if (!req.user) {
            console.log('User is not authenticated');
            return res.status(401).json({ msg: "Unauthorized: Please log in to access courses" });
        }

        // Allow access for users with "admin" or other roles
        if (req.user.role !== "admin") {
            console.log('User does not have admin role');
           
        }

        console.log('Fetching courses...');

        let response;

        // Fetch courses based on user role
        if (req.user.role === "admin") {
            response = await Courses.findAll({
                attributes: ['courseId', 'name', 'description', 'price', 'examFees', 'courseFees', 'duration', 'status'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            response = await Courses.findAll({
                attributes: ['courseId', 'name', 'description', 'price', 'examFees', 'courseFees', 'duration', 'status'],
                where: {
                    createdBy: req.user.uuid
                },
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }

        console.log('Courses fetched successfully:', response);

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ msg: error.message });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ msg: "Unauthorized: Please log in to access course details" });
        }

        const courseId = req.params.id;
        if (!courseId) {
            return res.status(400).json({ msg: "Invalid request: Course ID is missing" });
        }

        const course = await Courses.findOne({
            where: {
                courseId: courseId
            }
        });

        if (!course) {
            return res.status(404).json({ msg: "Course not found" });
        }

        if (req.user.role !== "admin" && req.user.uuid !== course.createdBy) {
            return res.status(403).json({ msg: "Forbidden: You don't have permission to access this course" });
        }

        let response;
        if (req.user.role === "admin") {
            response = await Courses.findOne({
                where: {
                    courseId: courseId
                },
                attributes: ['courseId', 'name', 'description',  'price', 'examFees', 'courseFees', 'duration', 'status'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            response = {
                uuid: course.uuid,
                name: course.name,
                description: course.description,
                image: course.image,
                price: course.price,
                examFees: course.examFees,
                courseFees: course.courseFees,
                duration: course.duration,
                status: course.status
            };
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.createCourse = async (req, res) => {
    try {
        const { 
            name, description,   
            examFees, courseFees, duration, status 
        } = req.body;

        const createdBy = req.user.uuid;
        const createdByName = req.user.name;

        if (!['user', 'admin'].includes(req.user.role)) {
            return res.status(403).json({ msg: "Forbidden: Only users with role 'user' or 'admin' can create a course" });
        }

        const requiredFields = ['name', 'description',  'examFees', 'courseFees', 'duration', 'status'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({ msg: "Missing required fields: " + missingFields.join(', ') });
        }

        const course = await Courses.create({
            name,
            description,
            examFees,
            courseFees,
            duration,
            status,
            createdBy,
            createdByName
        });

        res.status(201).json({ msg: "Course created successfully", course });
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ msg: "Failed to create course", error: error.message });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const course = await Courses.findOne({
            where: {
                courseId: req.params.id
            }
        });

        if (!course) {
            return res.status(404).json({ msg: "Course not found" });
        }

        if (req.user.role !== "admin" && req.user.uuid !== course.createdBy) {
            return res.status(403).json({ msg: "Forbidden: You don't have permission to update this course" });
        }

        const { name, description,  price, examFees, courseFees, duration, status } = req.body;

        await Courses.update(
            { 
                name, 
                description, 
                price,
                examFees, 
                courseFees, 
                duration, 
                status 
            },
            {
                where: {
                    courseId: req.params.id
                }
            }
        );

        res.status(200).json({ msg: "Course updated successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const course = await Courses.findOne({
            where: {
                courseId: req.params.id
            }
        });

        if (!course) {
            return res.status(404).json({ msg: "Course not found" });
        }

        if (req.user.role !== "admin" && req.user.uuid !== course.createdBy) {
            return res.status(403).json({ msg: "Forbidden: You don't have permission to delete this course" });
        }

        await Courses.destroy({
            where: {
                courseId: req.params.id
            }
        });

        res.status(200).json({ msg: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
