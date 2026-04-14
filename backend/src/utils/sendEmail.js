const DEV_EMAIL = "chandanyadavcbr2004@gmail.com";

const sendEmail = (to, subject, html) => {
  resend.emails.send({
    from: "onboarding@resend.dev",
    to: [DEV_EMAIL], // 🔥 always your email
    subject,
    html: `
      <p><b>Original recipient:</b> ${to}</p>
      <hr/>
      ${html}
    `,
  });
};