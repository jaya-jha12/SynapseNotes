import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.post('/send', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        // 1. Create Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // testermailuser14@gmail.com
                pass: process.env.EMAIL_PASS  // App Password
            }
        });

        // 2. Configure Email
        const mailOptions = {
            from: `Synapse Contact Form <${process.env.EMAIL_USER}>`,
            to: 'testermailuser14@gmail.com', // Where you want to RECEIVE the mail
            replyTo: email, // So you can reply directly to the user
            subject: `New Message from ${name}`,
            text: `
                Name: ${name}
                Email: ${email}
                
                Message:
                ${message}
            `
        };

        // 3. Send Email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: "Email sent successfully!" });

    } catch (error) {
        console.error("Email Error:", error);
        res.status(500).json({ success: false, error: "Failed to send email" });
    }
});

export default router;