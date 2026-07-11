const nodemailer = require("nodemailer");

const sendOTPEmail = async (email, otp) => {
    try {

        console.log("SEND Otp start");
        console.log("EMAIL_USER:", process.env.EMAIL_USER);
        console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    console.log("Transporter created");
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "ArtStore Email Verification",
        html: `<h2>Your OTP is: ${otp}</h2>
               <p>This OTP expires in 10 minutes.</p>`
    };
    console.log("Sending otp email");
    await transporter.sendMail(mailOptions);
    console.log("otp email sent successfully");
}
 catch (err) {
        console.error("OTP Email Error:", err);
        throw err;
    }
};

const sendResetEmail = async (email, token) => {
    try {
    console.log("SEND RESET START");
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    console.log("Transporter created");
    // const resetLink = `http://localhost:3000/reset-password/${token}`;
    const resetLink = `${process.env.BASE_URL}/reset-password/${token}`;
    console.log("Reset Link:", resetLink);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset your password",
        html: `<h2>click below to reset password</h2>
               <a href="${resetLink}">Reset Password</a>
               <p>Link expires in 15 minutes</p>`
    };
    console.log("Calling sendmail");
    await transporter.sendMail(mailOptions);
    console.log("Reset email sent successfully");
    } catch (err) {
        console.error("RESET EMAIL ERROR:", err);
        throw err;
    }
};

module.exports = { sendOTPEmail,sendResetEmail};