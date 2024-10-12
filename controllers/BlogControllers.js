// controllers/BlogController.js
const Blog = require("../models/blog.js"); // Import your Blog model
const { uploadimage } = require("../middleware/FileUpload.js"); 
const path = require('path'); // Import the path module
const fs = require('fs'); // Import the fs module
// Create a new blog post
// const createBlog = async (req, res) => {
//     if (req.user.role !== "admin") {
//         console.log('User does not have admin role');
//         return res.status(403).json({ message: "Access denied. Admins only." });
//     }

//     try {
//         const { title, description, date, photo } = req.body;
//         const newBlog = await Blog.create({ title, description, date, photo });
//         return res.status(201).json(newBlog);
//     } catch (error) {
//         return res.status(500).json({ message: "Error creating blog.", error });
//     }
// };
const createBlog = async (req, res) => {
    // Handle file upload using Multer middleware
    uploadimage(req, res, async function (err) {
        if (err) {
            console.error("Multer error:", err);
            return res.status(500).json({ message: err.message });
        }

        // Extract the blog details from the request body
        const { title, description, date } = req.body;

        try {
            // Check if an image was uploaded and log the image path if it exists
            let photoPath = null;
            if (req.files && req.files['photo']) {
                photoPath = req.files['photo'][0].path;
                console.log("Photo path:", photoPath);
            }

            // Create the blog post and store the photo path (if uploaded)
            const newBlog = await Blog.create({
                title,
                description,
                date,
                photo: photoPath // Store the image path (null if not uploaded)
            });

            console.log("Blog created successfully:", newBlog);

            // Respond with the newly created blog
            res.status(201).json({ msg: "Blog created successfully", newBlog });
        } catch (error) {
            console.error("Failed to create blog:", error);
            res.status(500).json({ msg: error.message });
        }
    });
};

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.findAll();
        res.status(200).json(blogs);
    } catch (error) {
        console.error("Failed to fetch blogs:", error);
        res.status(500).json({ message: "Failed to fetch blogs" });
    }
};

const getBlogById = async (req, res) => {
    const { id } = req.params;
    try {
        // Fetch the blog post by ID
        const blog = await Blog.findByPk(id);

        // Check if the blog exists
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Return the blog details including the photo path
        res.status(200).json({
            blogId: blog.blogId,
            title: blog.title,
            description: blog.description,
            date: blog.date,
            photo: blog.photo, // Include the photo path
            createdAt: blog.createdAt,
            updatedAt: blog.updatedAt,
        });
    } catch (error) {
        console.error("Failed to fetch blog:", error);
        res.status(500).json({ message: "Failed to fetch blog" });
    }
};

// Update a blog post
const updateBlog = async (req, res) => {
    uploadimage(req, res, async function (err) {
        if (err) {
            console.error("Multer error:", err);
            return res.status(500).json({ message: err.message });
        }

        const { id } = req.params;
        const { title, description, date } = req.body;
        try {
            const blog = await Blog.findByPk(id);
            if (!blog) {
                return res.status(404).json({ message: "Blog not found" });
            }

            let photoPath = blog.photo;
            if (req.files && req.files['photo']) {
                photoPath = req.files['photo'][0].path;
            }

            // Update blog fields
            blog.title = title || blog.title;
            blog.description = description || blog.description;
            blog.date = date || blog.date;
            blog.photo = photoPath;

            // Save updated blog
            await blog.save();

            res.status(200).json({ message: "Blog updated successfully", blog });
        } catch (error) {
            console.error("Failed to update blog:", error);
            res.status(500).json({ message: "Failed to update blog" });
        }
    });
};

// Delete a blog post
const deleteBlog = async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blog.findByPk(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // If the blog has a photo, delete the image from the file system
        if (blog.photo) {
            const photoPath = path.resolve(blog.photo); // Resolve full path
            fs.unlink(photoPath, (err) => {
                if (err) {
                    console.error("Error deleting image:", err);
                } else {
                    console.log("Image deleted successfully:", photoPath);
                }
            });
        }

        // Delete the blog entry from the database
        await blog.destroy();
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        console.error("Failed to delete blog:", error);
        res.status(500).json({ message: "Failed to delete blog" });
    }
};

module.exports = {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
};
