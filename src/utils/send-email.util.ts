import nodemailer from "nodemailer";

/**
 * Sends an email using Nodemailer
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param text - Plain text content of the email
 */
export const sendEmail = async (
  to: string,
  subject: string,
  text: string
): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or use SMTP settings
    auth: {
      user: process.env.EMAIL_USER as string,
      pass: process.env.EMAIL_PASS as string,
    },
  });

  await transporter.sendMail({
    from: `"Sociapi" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};
