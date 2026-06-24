const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/emailService");

const sendVerificationMail = async (user) => {
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const url = `${process.env.REACT_APP_API_BASE}/api/auth/verify/${token}`;

  await sendEmail({
    to: user.email,
    subject: "Email Verification",
    html: `<h3>Hello ${user.name},</h3>
           <p>Click the link below to verify your email:</p>
           <a href="${url}">Verify Now</a>
           <p>This link will expire in 1 hour.</p>`
  });
};

module.exports = sendVerificationMail;
