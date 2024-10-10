const express = require("express");
const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,getProfile,updateUserPassword,updateProfile
} = require("../controllers/Users.js");
const { verifyUser, adminOnly } = require("../middleware/AuthUser.js");
const { uploadimage } = require("../middleware/FileUpload.js");

const router = express.Router();

router.get('/users', verifyUser, getUsers);
router.get('/users/:id', verifyUser, getUserById);
router.post('/users',verifyUser, createUser);
router.patch('/users/:id', verifyUser, updateUser);
router.delete('/users/:id', verifyUser, deleteUser);
router.get('/myprofile',verifyUser,getProfile);
router.patch('/updateprofile',verifyUser,updateProfile);

router.patch('/updatepassword',verifyUser,updateUserPassword);


module.exports = router;
