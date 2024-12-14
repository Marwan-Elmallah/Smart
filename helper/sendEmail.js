const nodemailer = require("nodemailer");

const sendEmail = async (destination, message) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.forwardemail.net",
            service: "gmail",
            port: 465,
            secure: true,
            auth: {
                // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                user: process.env.SENDER_EMAIL,
                pass: process.env.SENDER_PASS
            }
        });
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: process.env.SENDER_EMAIL, // sender address
            to: destination, // list of receivers
            subject: "Confirmation email", // Subject line
            text: "Hello world BRO..  :D", // plain text body
            html: message, // html body
        });
        return info
    } catch (error) {
        return error
    }
}

module.exports = sendEmail