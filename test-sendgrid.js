require('dotenv').config();
const { sendMail } = require('./src/utils/mailer');

async function testSendGrid() {
  try {
    console.log('Testing SendGrid email sending...');
    
    // Debug environment variables
    console.log('=== EMAIL CONFIG DEBUG ===');
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_PORT:', process.env.SMTP_PORT);
    console.log('SMTP_SECURE:', process.env.SMTP_SECURE);
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'SET' : 'NOT SET');
    console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
    console.log('==========================');
    
    // Use a real email address for testing
    const testEmail = process.env.TEST_EMAIL || process.env.SMTP_USER || 'kalyankumar.muli64@gmail.com';
    
    console.log(`Sending test email to ${testEmail}...`);
    const result = await sendMail({
      to: testEmail,
      subject: 'WE TOO - Test Email Configuration with SendGrid Fallback',
      text: `
        This is a test email to verify that the email configuration is working correctly.
        This test includes both SMTP and SendGrid fallback options.
        
        If you received this email, it means the email system is properly configured.
        
        Best regards,
        WE TOO Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3498db;">WE TOO - Test Email Configuration with SendGrid Fallback</h2>
          <p>This is a test email to verify that the email configuration is working correctly.</p>
          <p>This test includes both SMTP and SendGrid fallback options.</p>
          <p>If you received this email, it means the email system is properly configured.</p>
          <br>
          <p>Best regards,<br>The WE TOO Team</p>
        </div>
      `
    });
    
    console.log('✅ Email sent successfully!');
    console.log('Result:', result);
    
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    console.error('Error code:', error.code);
    console.error('Error command:', error.command);
  }
}

testSendGrid();