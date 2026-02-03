import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateResetToken, getResetTokenExpiry } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email },
    });

    // Always return success even if user doesn't exist (security best practice)
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link.',
      });
    }

    // Generate reset token and expiry
    const resetToken = generateResetToken();
    const resetTokenExpiry = getResetTokenExpiry();

    // Update user with reset token
    await db.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    /*
     * SEND PASSWORD RESET EMAIL
     * ==========================
     * To enable password reset emails, uncomment the following code
     * and configure your SMTP settings in .env file
     */
    /*
    const emailSent = await sendPasswordResetEmail(email, resetToken, user.fullName);
    if (!emailSent) {
      console.error('Failed to send password reset email');
    }
    */

    // For development, log reset token to console (remove in production)
    console.log('Password reset token for', email, ':', resetToken);

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link.',
      // Only include token in development mode
      ...(process.env.NODE_ENV === 'development' && { resetToken }),
    });
  } catch (error) {
    console.error('Request password reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
