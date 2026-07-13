const { BrevoClient } = require("@getbrevo/brevo");

const brevo =new BrevoClient({
    apiKey: process.env.art_brevo_api_key,
});

const  sender ={
    name: "Aasia's Art",
    email: process.env.EMAIL_USER,  };

const sendOTPEmail=async(email, otp)=>{
    try{
        await brevo.transactionalEmails.sendTransacEmail({
            sender,
            to: [{email }],
            subject: "artstore email verification",
            htmlContent: `
                <h2>Your OTP is: ${otp}</h2>
                <p>This OTP expires in 10 minutes.</p>
            `,
        });

        console.log("otp email sent succrssfully");
    }  catch (err) {
         console.error("OTP email error:", err);
        throw err;
        }
};

const sendResetEmail = async (email, token) => {
    try {
        const resetLink = `${process.env.BASE_URL}/reset-password/${token}`;
        await brevo.transactionalEmails.sendTransacEmail({
            sender,
            to: [{ email }],
             subject: "Reset your password",
            htmlContent: `
                <h2>Click below to reset your password</h2>
                 <a href="${resetLink}">Reset Password</a>
                <p>Link expires in 15 minutes.</p>
            `,
        });

        console.log("reset email sent successfully");
    } catch (err) {
        console.error("reset email error", err);
        throw err;
    }
};

module.exports = { sendOTPEmail, sendResetEmail };
