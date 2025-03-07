import nodemailer from "nodemailer";
import { EventEmitter } from "events";
export const sendEmailService = async ({ to, subject, html, attachments = [] }) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.PASSWORD_USER,
        },
    });
    const info = await transporter.sendMail({
        from: `Job Sprint <${process.env.EMAIL_USER}>`, // sender address
        to,
        subject,
        html,
        attachments,
    });
    return info;
};

export const emitter = new EventEmitter();
emitter.on("sendEmail", (...args) => {
    const { to, subject, html, attachments } = args[0];
    sendEmailService({
        to,
        subject,
        html,
        attachments,
    });
});