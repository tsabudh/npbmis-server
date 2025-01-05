import nodemailer from "nodemailer";
export const localTransporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025, // Mailhog's default SMTP port
  secure: false, // No SSL for local testing
});

export const sendLocalMail = (mailOptions) => {
  localTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error("Error sending email:", error);
    }
    console.log("Email sent:", info.response);
  });
};
