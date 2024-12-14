const nodemailer = require('nodemailer');
const Helper = require('./Helper');
const config = require('../config');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
        user: process.env.MAIL_AUTH_USERNAME,
        pass: process.env.MAIL_AUTH_PASSWORD,
    },
});
class MailManger {
    constructor() { }
    /**
     * Sends an email to the specified address with the given subject, text, template, and optional attachments.
     *
     * @param {string} email - The email address to send the email to.
     * @param {string} subject - The subject of the email.
     * @param {string} text - The content of the email.
     * @param {string} template - The template to use for the email.
     * @param {Array} attachments - (Optional) An array of file attachments to include in the email.
     * @return {Object} - An object containing the status and data of the email sending operation.
     */
    static async send(email, subject, text, template, attachments) {
        try {
            let send;
            let options = {
                from: `${config.APP_NAME} <${process.env.MAIL_AUTH_USERNAME}>`,
                to: email,
                subject: subject,
                text: text,
                html: template,
            };
            if (!attachments) {
                send = await transporter.sendMail(options);
            } else {
                send = await transporter.sendMail({
                    ...options,
                    attachments,
                });
            }
            Helper.writeJson('logs/mail-logs.json', {
                status: 'success',
                data: send,
            });
            console.log(`Mail Sent to ${email}`);
            return {
                status: 'Done',
                data: send,
            };
        } catch (error) {
            Helper.writeJson('logs/mail-logs.json', {
                status: 'error',
                data: error,
            });
            console.log("Mail Error", error);
            return {
                status: 'Fail',
                error: error.message,
            };
        }
    }
}

module.exports = MailManger;
