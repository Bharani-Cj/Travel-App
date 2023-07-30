const nodemailer = require('nodemailer');

exports.sendEmail = async (obj) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const Emailer = {
    from: 'Bharani <bharani.cj@gmail.com>',
    to: obj.email,
    subject: obj.subject,
    text: obj.message,
  };

  await transporter.sendMail(Emailer);
};
