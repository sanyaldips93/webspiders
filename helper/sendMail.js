const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

// defining the mail carrier
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY
    }
  })
);

// mail execution
exports.sendMail = (object) => {
  return new Promise((resolve, reject) => {
      const emailMessage = {
          from: 'sanyaldips@gmail.com',
          to: process.env.EMAIL_WEBSPIDERS,            // List of recipients
          subject: 'WebSpiders ChatBox',            // Subject line
          text: `${object.username} joined chat..`  // Plain text body
      };
      console.log('inside mail');
      transporter.sendMail(emailMessage)
        .then(result => console.log(result))
        .catch(err => console.log(err))

      resolve('Mail sent!!');
  })
}
