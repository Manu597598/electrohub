import nodemailer from "nodemailer";

export const sendVerificationEmail = async (token, email) => {
  const verificationLink = `http://localhost:5173/verify/${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"No Reply" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Verify your email",
    html: `
      <h2>Email Verification</h2>
      <p>Click below to verify:</p>
      <a href="${verificationLink}">${verificationLink}</a>
    `,
  });
};
