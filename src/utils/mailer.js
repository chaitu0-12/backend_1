const nodemailer = require('nodemailer');

function createTransport() {
  const host = process.env.SMTP_HOST || 'localhost';
  const port = Number(process.env.SMTP_PORT || 1025);
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure, // true for 465, false for other ports
    auth: user && pass ? { user, pass } : undefined,
    tls: {
      rejectUnauthorized: false // Accept self-signed certificates
    },
    connectionTimeout: 30000, // 30 seconds timeout
    greetingTimeout: 30000,
    socketTimeout: 30000
  });
  return transporter;
}

async function sendMail({ to, subject, text, html }) {
  const from = process.env.EMAIL_FROM || 'WE TOO <noreply@wetoo.local>';
  const transporter = createTransport();
  
  try {
    const result = await transporter.sendMail({ from, to, subject, text, html });
    console.log('✅ Email sent successfully to:', to);
    return result;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    // Still throw the error so the calling function can handle it appropriately
    throw error;
  }
}

module.exports = { sendMail };