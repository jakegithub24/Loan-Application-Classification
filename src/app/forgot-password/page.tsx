'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailSent(true);
        if (data.resetToken) {
          setResetToken(data.resetToken);
        }
        toast({
          title: 'Email Sent',
          description: data.message,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Failed to send reset link',
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
              <p className="text-sm text-blue-200">Reset Password</p>
            </div>
          </Link>
        </div>

        {/* Card */}
        <Card className="border-0 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-blue-900 text-center">
              {emailSent ? 'Check Your Email' : 'Forgot Password?'}
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              {emailSent
                ? 'We sent a password reset link to your email'
                : 'Enter your email to receive a password reset link'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!emailSent ? (
              // Step 1: Request Reset
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-blue-900 font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      Sending Reset Link...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>

                <div className="text-center">
                  <Link href="/login" className="inline-flex items-center text-sm text-blue-900 hover:text-blue-700 font-medium">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Login
                  </Link>
                </div>
              </form>
            ) : (
              // Step 2: Email Sent
              <div className="space-y-6">
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <p className="text-gray-600">
                    We've sent a password reset link to:
                  </p>
                  <p className="font-semibold text-blue-900 mt-1">{email}</p>
                </div>

                {resetToken && process.env.NODE_ENV === 'development' && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 text-center">
                      <span className="font-semibold">Development Token:</span>
                    </p>
                    <p className="text-xs text-yellow-700 text-center mt-1 break-all font-mono">
                      {resetToken}
                    </p>
                    <Link
                      href={`/reset-password?token=${resetToken}`}
                      className="block mt-3 text-center text-sm text-blue-900 hover:underline font-semibold"
                    >
                      Click here to reset password
                    </Link>
                  </div>
                )}

                <Button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                    setResetToken('');
                  }}
                  variant="outline"
                  className="w-full h-12 border-gray-300 hover:border-blue-900 hover:text-blue-900"
                >
                  Try Another Email
                </Button>

                <div className="text-center">
                  <Link href="/login" className="inline-flex items-center text-sm text-blue-900 hover:text-blue-700 font-medium">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Login
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
