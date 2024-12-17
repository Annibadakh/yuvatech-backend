const express = require('express');
const { updateDueDate } = require('../controllers/DueDate.js');
const { verifyUser } = require('../middleware/AuthUser.js');
const router = express.Router();

router.patch('/updateDueDate/:enrollmentId', verifyUser, updateDueDate);

module.exports = router;