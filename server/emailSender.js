const mailgun = require('mailgun-js');
// const DOMAIN = "mg.freejoas.com";
const DOMAIN = "sandboxd14fe87045614874ae27cff252527954.mailgun.org";
const mg = mailgun({apiKey: '76568df9b83182278eb28635e5010ee7-51356527-19c11fb5', domain: DOMAIN});

function sendEmail() {
    const data = {
        from: "Mailgun Sandbox <postmaster@mg.freejoas.com>",
        to: "wsking233@gmail.com",
        subject: "Hello",
        template: "verify email address",
        'h:X-Mailgun-Variables': {test: "test"}
    };

  mg.messages().send(data, function (error, body) {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent:', body);
    }
  });
}

module.exports = { sendEmail };
