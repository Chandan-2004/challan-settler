const resend = require("../config/resend");

const DEV_EMAIL = "chandanyadavcbr2004@gmail.com";

const sendEmail = async (to, subject, html) => {
  try {
    console.log("Sending email to:", DEV_EMAIL);

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [DEV_EMAIL],
      subject,
      html: `
        <p><b>Original recipient:</b> ${to}</p>
        <hr/>
        ${html}
      `,
    });

    console.log("Email sent successfully");
  } catch (err) {
    console.error("Email error:", err.message);
  }
};

module.exports = sendEmail;