const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendNotificationEmail = async (subject, data) => {
    try {
        const info = await transporter.sendMail({
            from: `"El Canal Web" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Self notification
            subject: subject,
            text: JSON.stringify(data, null, 2),
            html: `<h3>${subject}</h3><pre>${JSON.stringify(data, null, 2)}</pre>`
        });
        console.log('Email enviado: %s', info.messageId);
    } catch (error) {
        console.error('Error al enviar email notification:', error);
    }
};

module.exports = { sendNotificationEmail };
