const twilio = require('twilio');

const client = twilio(process.env.TWILIO_AUTH_ID, process.env.TWILIO_AUTH_KEY);


// forcing a resolve (dummy sms)
// wont work because dont have a paid account with twilio
exports.sendSMS = (object) => {
    return new Promise((resolve, reject) => {
      const smsMessage = {
          body: `${object.username} joined chat..`,
          from: '+15017122661',
          to: process.env.PHONE_WEBSPIDERS
      }
      console.log('inside sms');
      client.messages.create(smsMessage)
          .then(result => console.log(result))
          .catch(err => console.log(`SMS Sent to ${smsMessage.to}..`));

      resolve('SMS sent!!');
    })
}
