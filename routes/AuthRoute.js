

const express = require("express");
const { Login, logOut, Me } = require("../controllers/Auth.js");
const { verifyUser } = require("../middleware/AuthUser.js");

const router = express.Router();

// Route to get user's profile information
router.get('/me', verifyUser, Me);

// Route to log in
router.post('/login', Login);

// Route to log out
router.delete('/logout', verifyUser, logOut);

// Export the router
module.exports = router;
