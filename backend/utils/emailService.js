const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"DHP Project" <${process.env.EMAIL_SENDER}>`,
    to,
    subject,
    html
  });
};

module.exports = { sendEmail };
