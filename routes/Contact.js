const express = require('express');
const Contact = require('../models/ContactModel.js');
const { verifyUser } = require('../middleware/AuthUser.js');
const { getAllContacts } = require('../controllers/Contact.js');

const router = express.Router();

router.post('/contact', async (req, res) => {
    try {
        const { name, email, phone_number, message } = req.body;
        const newContact = await Contact.create({
            name,
            email,
            phone_number,
            message
        });
        res.status(200).json({ message: 'Message received! We will get back to you soon.' });
    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/contacts', verifyUser, getAllContacts);

module.exports = router;
