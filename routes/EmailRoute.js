// routes/EmailRoute.js
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
require('dotenv').config();

router.post('/send-email', async (req, res) => {
    const { to, subject, text, pdfBase64 } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL, // Your email
            pass: process.env.PASSWORD // Your email password
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        text: text,
        attachments: [
            {
                filename: 'receipt.pdf',
                content: pdfBase64,
                encoding: 'base64'
            }
        ]
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent: ' + info.response);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

module.exports = router;
