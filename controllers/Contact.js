const Contact = require('../models/ContactModel.js');

exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.findAll();

        const formattedContacts = contacts.map(contact => ({
            name: contact.name,
            email: contact.email,
            message: contact.message,
            phone_number: contact.phone_number
        }));

        res.status(200).json(formattedContacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
