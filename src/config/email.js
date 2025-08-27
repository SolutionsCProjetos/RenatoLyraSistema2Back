const nodemailer = require("nodemailer");

let transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        ciphers: "SSLv3"
    }
});

module.exports = transport;