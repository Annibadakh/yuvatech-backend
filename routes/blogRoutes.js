// routes/blogRoutes.js
const express = require("express");
const {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
} = require("../controllers/BlogControllers");
const { verifyUser } = require("../middleware/AuthUser.js");
const Blog = require("../models/blog.js"); // Import your Blog model

const router = express.Router();

router.post("/createblog",verifyUser, createBlog);            // Create a new blog
router.get("/getblog", getAllBlogs);            // Get all blogs
router.get("/blogby/:id", verifyUser,getBlogById);         // Get a blog by ID
router.put("/updateblog/:id", verifyUser,updateBlog);          // Update a blog by ID
router.delete("/blog/:id",verifyUser, deleteBlog);       // Delete a blog by ID

module.exports = router;
