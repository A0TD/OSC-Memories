import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "142.250.185.109", // Google's official SMTP IPv4 address for smtp.gmail.com
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    // Required because the IP address won't match the SSL certificate name ("smtp.gmail.com") directly without this
    rejectUnauthorized: false 
  }
} as any);

export default transporter;
