const bcrypt = require('bcrypt');
const { OtpToken } = require('../models');
const { sendMail } = require('../utils/mailer');
const { sequelize } = require('../models');

// 🔹 Generate a random 6-digit OTP
function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// 🔹 Request OTP (for registration or password reset)
async function requestOtp(req, res) {
  const { email, purpose = 'reset' } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });
  
  try {
    // For registration purpose, don't check if email exists
    if (purpose === 'reset') {
      // Check if email exists in either Student or Senior database using raw queries
      const [studentResult] = await sequelize.query(
        'SELECT COUNT(*) as count FROM students WHERE email = ?',
        { replacements: [email] }
      );
      
      const [seniorResult] = await sequelize.query(
        'SELECT COUNT(*) as count FROM seniors WHERE email = ?',
        { replacements: [email] }
      );
      
      const studentCount = studentResult[0].count;
      const seniorCount = seniorResult[0].count;
      
      // If user doesn't exist in either database, return error
      if (studentCount === 0 && seniorCount === 0) {
        return res.status(404).json({ message: 'Email not found. Please check your email address or register first.' });
      }
    }
    
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await OtpToken.create({ email, code, purpose, expiresAt });
    
    // Send detailed email with OTP
    const emailHtml = purpose === 'registration' ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3498db;">WE TOO - Email Verification</h2>
        <p>Hello,</p>
        <p>Thank you for registering with WE TOO. Please verify your email address to continue.</p>
        <p style="font-size: 20px; font-weight: bold; color: #e74c3c;">Your verification code is: ${code}</p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request this verification, please ignore this email.</p>
        <br>
        <p>Best regards,<br>The WE TOO Team</p>
      </div>
    ` : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3498db;">WE TOO - Password Reset</h2>
        <p>Hello,</p>
        <p>You have requested to reset your password for your WE TOO account.</p>
        <p style="font-size: 20px; font-weight: bold; color: #e74c3c;">Your OTP code is: ${code}</p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request this password reset, please ignore this email.</p>
        <br>
        <p>Best regards,<br>The WE TOO Team</p>
      </div>
    `;

    const emailText = purpose === 'registration' ? `
      WE TOO - Email Verification
      
      Hello,
      
      Thank you for registering with WE TOO. Please verify your email address to continue.
      
      Your verification code is: ${code}
      
      This code will expire in 10 minutes.
      
      If you did not request this verification, please ignore this email.
      
      Best regards,
      The WE TOO Team
    ` : `
      WE TOO - Password Reset
      
      Hello,
      
      You have requested to reset your password for your WE TOO account.
      
      Your OTP code is: ${code}
      
      This code will expire in 10 minutes.
      
      If you did not request this password reset, please ignore this email.
      
      Best regards,
      The WE TOO Team
    `;

    try {
      await sendMail({
        to: email,
        subject: purpose === 'registration' ? 'WE TOO - Email Verification Code' : 'WE TOO - Password Reset OTP',
        text: emailText,
        html: emailHtml
      });
      
      // Email sent successfully
      return res.json({ 
        message: 'OTP sent successfully. Please check your email.', 
        otp: process.env.NODE_ENV === 'development' ? code : undefined // Only expose OTP in development
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email sending fails, still return success
      // The user can still use the OTP code by checking the database or in development mode
      return res.json({ 
        message: 'OTP generated successfully. Please check your email or contact support if you don\'t receive it.', 
        otp: process.env.NODE_ENV === 'development' ? code : undefined // Only expose OTP in development
      });
    }
    
  } catch (error) {
    console.error('Error in requestOtp:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// 🔹 Verify OTP
async function verifyOtp(req, res) {
  const { email, code, purpose = 'reset' } = req.body;
  if (!email || !code)
    return res.status(400).json({ message: 'Email and code required' });

  try {
    const token = await OtpToken.findOne({
      where: { email, code, purpose, used: false },
    });

    if (!token)
      return res.status(400).json({ message: 'Invalid or used code.' });

    // Compare using UTC-safe timestamps
    if (new Date(token.expiresAt).getTime() < Date.now()) {
      return res
        .status(400)
        .json({ message: 'Code expired. Please request a new OTP.' });
    }

    // Mark as used for registration
    if (purpose === 'registration') {
      await token.update({ used: true });
    }

    return res.json({ message: 'OTP verified successfully.' });
  } catch (error) {
    console.error('❌ Error in verifyOtp:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// 🔹 Reset Password
async function resetPassword(req, res) {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword)
    return res.status(400).json({ message: 'Missing fields' });

  try {
    const token = await OtpToken.findOne({
      where: { email, code, purpose: 'reset', used: false },
    });

    if (!token)
      return res.status(400).json({ message: 'Invalid or used OTP code.' });

    if (new Date(token.expiresAt).getTime() < Date.now()) {
      return res
        .status(400)
        .json({ message: 'OTP expired. Please request a new one.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    // 🔹 Update password in both tables
    const [studentResult] = await sequelize.query(
      'UPDATE students SET passwordHash = ? WHERE email = ?',
      { replacements: [passwordHash, email] }
    );

    const [seniorResult] = await sequelize.query(
      'UPDATE seniors SET passwordHash = ? WHERE email = ?',
      { replacements: [passwordHash, email] }
    );

    await token.update({ used: true });

    const studentUpdated = studentResult?.rowCount > 0;
    const seniorUpdated = seniorResult?.rowCount > 0;

    if (!studentUpdated && !seniorUpdated) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // 🔹 Send confirmation email
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3498db;">WE TOO - Password Reset Successful</h2>
        <p>Hello,</p>
        <p>Your password has been successfully reset for your WE TOO account.</p>
        <p>If you did not perform this action, please contact our support team immediately.</p>
        <br>
        <p>Best regards,<br>The WE TOO Team</p>
      </div>
    `;

    const text = `
      WE TOO - Password Reset Successful

      Hello,

      Your password has been successfully reset for your WE TOO account.

      If you did not perform this action, please contact our support team immediately.

      Best regards,
      The WE TOO Team
    `;

    try {
      await sendMail({
        to: email,
        subject: 'WE TOO - Password Reset Successful',
        text,
        html,
      });
    } catch (emailError) {
      console.error('Password reset confirmation email failed:', emailError);
      // Don't fail the request if email sending fails
    }

    return res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('❌ Error in resetPassword:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { requestOtp, verifyOtp, resetPassword };