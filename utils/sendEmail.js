const nodeoutlook = require("nodejs-nodemailer-outlook");
const nodemailer=require("nodemailer")
async function sendEmail(dest, message) {
  nodeoutlook.sendEmail({
    auth: {
      user: "reemsina1@outlook.com",
      pass: "a6dg7ia4",
    },
    from: "reemsina1@outlook.com",
    to: dest,
    subject: "Hey you, awesome!",
    html: message,
    text: "This is text version!",
    replyTo: "receiverXXX@gmail.com",
    onError: (e) => console.log(e),
    onSuccess: (i) => console.log(i),
  });
}

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: "reemsina23@outlook.com",
    pass: "a6dg7ia4",
  },
});

async function sendSmsEmail(phoneNumber, carrierGateway, message) {
  const to = `${phoneNumber}@${carrierGateway}`;
  await transporter.sendMail({
    from: "reemsina23@outlook.com",
    to,
    subject: "", // SMS ignores subject
    text: message,
  });
  console.log(`Message sent to ${phoneNumber} via email-to-SMS`);
}
module.exports = {sendEmail, sendSmsEmail};
