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

module.exports = sendOTPEmail;