const nodemailer = require("nodemailer");

const sendEmail = async (toEmail, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL, // Your Gmail address
        pass: process.env.APP_PASS, // Your App Password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: toEmail,
      subject: subject,
      text: text,
    };

    // Send Email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email.");
  }
};

module.exports = sendEmail;
