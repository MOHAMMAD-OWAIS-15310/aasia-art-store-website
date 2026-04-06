const nodemailer = require("nodemailer");

const sendOTPEmail = async (email, otp) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "ArtStore Email Verification",
        html: `<h2>Your OTP is: ${otp}</h2>
               <p>This OTP expires in 10 minutes.</p>`
    };

    await transporter.sendMail(mailOptions);
};

const sendResetEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    const resetLink = `http://localhost:3000/reset-password/${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset your password",
        html: `<h2>click below to reset password</h2>
               <a href="${resetLink}">Reset Password</a>
               <p>Link expires in 15 minutes</p>`
    };
    await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail,sendResetEmail};