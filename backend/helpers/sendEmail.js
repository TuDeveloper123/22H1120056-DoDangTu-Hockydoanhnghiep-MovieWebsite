// File Path: backend/helpers/sendEmail.js

const nodemailer = require('nodemailer');
require('dotenv').config();

// Cấu hình transporter (người gửi email) sử dụng Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_EMAIL, // Email của bạn
        pass: process.env.EMAIL_PASSWORD // App Password bạn đã tạo
    }
});

/**
 * Hàm gửi email
 * @param {object} options - Các tùy chọn email
 * @param {string} options.to - Email người nhận
 * @param {string} options.subject - Tiêu đề email
 * @param {string} options.html - Nội dung email dạng HTML
 */
const sendEmail = async ({ to, subject, html }) => {
    try {
        const mailOptions = {
            from: `"Cinemas Support" <${process.env.SENDER_EMAIL}>`, // Tên người gửi và email
            to: to,
            subject: subject,
            html: html
        };

        // Gửi email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return true;
    } catch (error) {
        console.error('Error sending email: ', error);
        return false;
    }
};

module.exports = sendEmail;