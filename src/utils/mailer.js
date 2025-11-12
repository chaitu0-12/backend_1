const nodemailer = require('nodemailer');

// Try to load SendGrid if available
let sgMail;
try {
  sgMail = require('@sendgrid/mail');
  console.log('📧 SendGrid module loaded successfully');
} catch (error) {
  console.log('📧 SendGrid module not available, using SMTP only');
}

function createTransport() {
  const host = process.env.SMTP_HOST || 'localhost';
  const port = Number(process.env.SMTP_PORT || 1025);
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  console.log(`📧 Creating SMTP transport: ${host}:${port}, secure: ${secure}, user: ${user}`);

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

async function sendMailWithSMTP({ to, subject, text, html, from }) {
  const transporter = createTransport();
  
  console.log(`📧 Preparing to send email via SMTP from ${from} to ${to} with subject: ${subject}`);
  
  try {
    const result = await transporter.sendMail({ from, to, subject, text, html });
    console.log('✅ Email sent successfully via SMTP to:', to);
    return { success: true, method: 'smtp', result };
  } catch (error) {
    console.error('❌ SMTP email sending failed:', error.message);
    return { success: false, method: 'smtp', error };
  }
}

async function sendMailWithSendGrid({ to, subject, text, html, from }) {
  // Check if SendGrid is configured
  const sendGridApiKey = process.env.SENDGRID_API_KEY;
  if (!sendGridApiKey) {
    console.log('📧 SendGrid API key not configured, skipping SendGrid');
    return { success: false, method: 'sendgrid', error: new Error('SendGrid API key not configured') };
  }

  if (!sgMail) {
    console.log('📧 SendGrid module not available, skipping SendGrid');
    return { success: false, method: 'sendgrid', error: new Error('SendGrid module not available') };
  }

  try {
    sgMail.setApiKey(sendGridApiKey);
    
    console.log(`📧 Preparing to send email via SendGrid from ${from} to ${to} with subject: ${subject}`);
    
    const msg = {
      to,
      from,
      subject,
      text,
      html,
    };

    await sgMail.send(msg);
    console.log('✅ Email sent successfully via SendGrid to:', to);
    return { success: true, method: 'sendgrid' };
  } catch (error) {
    console.error('❌ SendGrid email sending failed:', error.message);
    return { success: false, method: 'sendgrid', error };
  }
}

async function sendMail({ to, subject, text, html }) {
  const from = process.env.EMAIL_FROM || 'WE TOO <noreply@wetoo.local>';
  
  console.log(`📧 Attempting to send email to ${to} with subject: ${subject}`);
  
  // Try SMTP first
  console.log('📧 Trying SMTP method first...');
  const smtpResult = await sendMailWithSMTP({ to, subject, text, html, from });
  
  if (smtpResult.success) {
    return smtpResult.result;
  }
  
  // If SMTP fails, try SendGrid as fallback
  console.log('📧 SMTP failed, trying SendGrid as fallback...');
  const sendGridResult = await sendMailWithSendGrid({ to, subject, text, html, from });
  
  if (sendGridResult.success) {
    return sendGridResult;
  }
  
  // Both methods failed
  console.error('❌ Both SMTP and SendGrid failed');
  console.error('SMTP Error:', smtpResult.error.message);
  console.error('SendGrid Error:', sendGridResult.error.message);
  
  // Throw the original SMTP error to maintain compatibility with existing error handling
  throw smtpResult.error;
}

module.exports = { sendMail };