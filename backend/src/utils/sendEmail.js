const resend = require("../config/resend");

const sendEmail = (to, subject, html) => {
  console.log("Sending email to:", to);

  resend.emails
    .send({
      from: "onboarding@resend.dev",
      to: [to], // ✅ IMPORTANT (array)
      subject,
      html,
    })
    .then((res) => console.log("Email success:", res))
    .catch((err) => console.error("Email failed:", err));
};

module.exports = sendEmail;