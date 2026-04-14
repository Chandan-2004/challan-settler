const resend = require("../config/resend");

const sendEmail = (to, subject, html) => {
  resend.emails
    .send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html,
    })
    .then(() => console.log(`Email sent to ${to}`))
    .catch((err) => console.error("Email error:", err));
};

module.exports = sendEmail;