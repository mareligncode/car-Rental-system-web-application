const nodemailer = require('nodemailer');
const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
            secure: false, // 👈 IMPORTANT for port 587

        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
          tls: {
      rejectUnauthorized: false, // 👈 helps avoid self-signed cert issues
    },
    });
    const mailOptions = {
        from: 'RentACar Support <support@rentacar.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
