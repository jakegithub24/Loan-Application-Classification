import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const ADMIN_JWT_EXPIRES_IN = process.env.ADMIN_JWT_EXPIRES_IN || '24h';

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Password verification
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate verification token
export function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

// Generate password reset token
export function generateResetToken(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

// Calculate reset token expiry (1 hour from now)
export function getResetTokenExpiry(): Date {
  return new Date(Date.now() + 60 * 60 * 1000);
}

// Generate JWT token for user
export function generateUserToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email, type: 'user' },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Generate JWT token for admin
export function generateAdminToken(adminId: string, username: string): string {
  return jwt.sign(
    { adminId, username, type: 'admin' },
    JWT_SECRET,
    { expiresIn: ADMIN_JWT_EXPIRES_IN }
  );
}

// Verify JWT token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Verify user token
export function verifyUserToken(token: string): { userId: string; email: string } | null {
  const decoded = verifyToken(token);
  if (decoded && decoded.type === 'user') {
    return { userId: decoded.userId, email: decoded.email };
  }
  return null;
}

// Verify admin token
export function verifyAdminToken(token: string): { adminId: string; username: string } | null {
  const decoded = verifyToken(token);
  if (decoded && decoded.type === 'admin') {
    return { adminId: decoded.adminId, username: decoded.username };
  }
  return null;
}

/*
 * EMAIL VERIFICATION USING NODEMAILER
 * ====================================
 * To enable email verification, install nodemailer:
 * bun add nodemailer && bun add -d @types/nodemailer
 *
 * Then uncomment and configure the following code:
 */

/*
import nodemailer from 'nodemailer';

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Send verification email with 6-digit OTP
export async function sendVerificationEmail(
  email: string,
  otp: string,
  fullName: string
): Promise<boolean> {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Loan Application System'}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Verify Your Email - Loan Application System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e3a5f;">Email Verification</h2>
          <p>Dear ${fullName},</p>
          <p>Thank you for registering with our Loan Application System. To complete your registration, please verify your email address using the following One-Time Password (OTP):</p>
          <div style="background-color: #f0f4f8; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #1e3a5f; letter-spacing: 8px;">${otp}</span>
          </div>
          <p>This OTP will expire in 10 minutes. Please do not share this with anyone.</p>
          <p>If you did not request this verification, please ignore this email.</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
}

// Send password reset email with reset link
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  fullName: string
): Promise<boolean> {
  try {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Loan Application System'}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Reset Your Password - Loan Application System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e3a5f;">Password Reset Request</h2>
          <p>Dear ${fullName},</p>
          <p>We received a request to reset your password for your Loan Application System account. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #1e3a5f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-size: 16px;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #1e3a5f; background: #f0f4f8; padding: 10px; border-radius: 5px;">${resetUrl}</p>
          <p>This link will expire in 1 hour. If you did not request a password reset, please ignore this email and your password will remain unchanged.</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
}
*/
