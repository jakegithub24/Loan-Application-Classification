import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, generateOTP, generateVerificationToken, generateUserToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, password } = body;

    // Validate required fields
    if (!fullName || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate OTP and verification token
    const otp = generateOTP();
    const verificationToken = generateVerificationToken();

    // Create user
    const user = await db.user.create({
      data: {
        fullName,
        email,
        phone,
        password: hashedPassword,
        verificationToken,
      },
    });

    /*
     * SEND VERIFICATION EMAIL WITH OTP
     * =================================
     * To enable email verification, uncomment the following code
     * and configure your SMTP settings in .env file
     */
    /*
    const emailSent = await sendVerificationEmail(email, otp, fullName);
    if (!emailSent) {
      console.error('Failed to send verification email');
    }
    */

    // For development, log OTP to console (remove in production)
    console.log('Verification OTP for', email, ':', otp);

    // Generate JWT token
    const token = generateUserToken(user.id, user.email);

    return NextResponse.json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      // Only include OTP in development mode
      ...(process.env.NODE_ENV === 'development' && { otp }),
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        isVerified: user.isVerified,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
