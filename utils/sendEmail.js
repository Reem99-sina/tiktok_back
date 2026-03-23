const nodemailer = require("nodemailer");
const { Resend } = require('resend');
require('dotenv').config()
const resend = new Resend(process.env.RESEND_API_KEY);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // reemsina2@gmail.com
    pass: 'lhid gzgm wqrd tiih', // app password
  },
});

/* ===============================
   Confirm Email
================================ */
const sendConfirmationEmail = async ({ to, name, link }) => {
  // return transporter.sendMail({
  //   from: `"My App" <${process.env.EMAIL_USER}>`,
  //   to,
  //   subject: "Verify your email",
  //   html: `
  //     <h3>Hello ${name}</h3>
  //     <p>Please Verify your email by clicking the link below:</p>
  //     ${link}
  //   `,
  // });
  return await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject: "Verify your email",
    html: `
      <h3>Hello ${name}</h3>
      <p>Please verify your email:</p>
      <a href="${link}">Verify</a>
    `,
  });
};

/* ===============================
   Code Email (OTP)
================================ */
const sendCodeEmail = async ({ to, code }) => {
  // return transporter.sendMail({
  //   from: `"My App" <${process.env.EMAIL_USER}>`,
  //   to,
  //   subject: "Your verification code",
  //   html: `<h3>Your code is: ${code}</h3>`,
  // });
  return await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject: "Your verification code",
    html: `<h3>Your code is: ${code}</h3> <p>This code expires in 10 minutes.</p>`,
  });
};

module.exports = {
  sendConfirmationEmail,
  sendCodeEmail,
};
