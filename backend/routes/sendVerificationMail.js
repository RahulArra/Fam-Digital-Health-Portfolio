const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const sendVerificationMail = async (user) => {
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  // Use BASE_URL dynamically set in ngrok-fetch.js
  const url = `https://digital-health-portfolio-backend.onrender.com/api/auth/verify/${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"DHP Project" <${process.env.EMAIL_SENDER}>`,
    to: user.email,
    subject: 'Email Verification',
    html: `<h3>Hello ${user.name},</h3>
           <p>Click the link below to verify your email:</p>
           <a href="${url}">Verify Now</a>
           <p>This link will expire in 1 hour.</p>`,
  });
};
module.exports = sendVerificationMail;
