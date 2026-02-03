'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Mail, Phone, Lock, User, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (userData.password !== userData.confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Passwords do not match',
      });
      return;
    }

    // Validate password strength
    if (userData.password.length < 8) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Password must be at least 8 characters long',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.phone,
          password: userData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedOtp(data.otp || '');
        setStep(2);
        toast({
          title: 'Registration successful!',
          description: 'Please verify your email.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Registration failed',
          description: data.error || 'An error occurred',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          otp: otp,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Email verified successfully!',
          description: 'Redirecting to login page...',
        });
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        toast({
          variant: 'destructive',
          title: 'Verification failed',
          description: data.error || 'Invalid OTP',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      // In production, this would call a resend OTP endpoint
      // For now, we'll just simulate it
      setTimeout(() => {
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(newOtp);
        setLoading(false);
        toast({
          title: 'OTP Resent',
          description: 'New OTP sent to your email!',
        });
        console.log('New OTP:', newOtp);
      }, 1000);
    } catch (error) {
      setLoading(false);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to resend OTP',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-blue-900" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white">SecureLoan</h1>
              <p className="text-sm text-blue-200">Create Your Account</p>
            </div>
          </Link>
        </div>

        {/* Registration Card */}
        <Card className="border-0 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-blue-900 text-center">
              {step === 1 ? 'Create Account' : 'Verify Email'}
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              {step === 1
                ? 'Fill in your details to get started'
                : 'Enter the 6-digit OTP sent to your email'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              // Step 1: Registration Form
              <form onSubmit={handleRegistrationSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-blue-900 font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={userData.fullName}
                      onChange={handleChange}
                      className="pl-10 h-12 border-gray-300 focus:border-blue-900"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-blue-900 font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={userData.email}
                      onChange={handleChange}
                      className="pl-10 h-12 border-gray-300 focus:border-blue-900"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-blue-900 font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+1 234 567 8900"
                      value={userData.phone}
                      onChange={handleChange}
                      className="pl-10 h-12 border-gray-300 focus:border-blue-900"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-blue-900 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={userData.password}
                      onChange={handleChange}
                      className="pl-10 h-12 border-gray-300 focus:border-blue-900"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-blue-900 font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={userData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10 h-12 border-gray-300 focus:border-blue-900"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white font-semibold text-base"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-900 hover:text-blue-700 font-semibold">
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            ) : (
              // Step 2: OTP Verification
              <form onSubmit={handleVerificationSubmit} className="space-y-6">
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-10 h-10 text-blue-900" />
                  </div>
                  <p className="text-gray-600 mb-2">
                    We've sent a 6-digit verification code to:
                  </p>
                  <p className="font-semibold text-blue-900">{userData.email}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-blue-900 font-medium text-center">
                    Enter 6-Digit OTP
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="h-14 text-center text-2xl font-bold tracking-widest border-gray-300 focus:border-blue-900"
                    maxLength={6}
                    required
                  />
                  {generatedOtp && process.env.NODE_ENV === 'development' && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                      <p className="text-sm text-yellow-800">
                        <span className="font-semibold">Development OTP:</span> {generatedOtp}
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white font-semibold text-base"
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Email'
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Didn't receive the code?{' '}
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={loading}
                      className="text-blue-900 hover:text-blue-700 font-semibold disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                  </p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="w-full text-blue-900 hover:text-blue-700"
                  disabled={loading}
                >
                  ← Back to Registration
                </Button>
              </form>
            )}

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-900 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Email Verification</p>
                  <p className="text-blue-800">
                    We'll send a 6-digit OTP to your email. In development mode, the OTP will be displayed on screen.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-blue-200 text-sm mt-6">
          By creating an account, you agree to our{' '}
          <Link href="#" className="underline hover:text-white">Terms of Service</Link> and{' '}
          <Link href="#" className="underline hover:text-white">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
