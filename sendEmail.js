const nodeMailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        // host: process.env.SMTP_HOST,
        // port: process.env.SMTP_PORT,
        // auth: {
        //     user: process.env.SMTP_EMAIL,
        //     pass: process.env.SMTP_PASSWORD,
        // },
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "dcd3a03fde780b",
          pass: "f5e275055dcfd0"
        }
    });

    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(message);
};

module.exports = sendEmail;