import { createTransport } from "nodemailer";

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = createTransport({
      host: process.env.HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject,
      text,
    });
  } catch (err) {
    console.error(err);
  }
};

export default sendEmail;
