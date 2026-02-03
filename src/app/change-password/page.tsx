'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserHeader } from '@/components/layout/UserHeader';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, CheckCircle2, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ChangePasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'New passwords do not match',
      });
      return;
    }

    // Validate password strength
    if (formData.newPassword.length < 8) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'New password must be at least 8 characters long',
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Please login to change password',
        });
        router.push('/login');
        return;
      }

      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        toast({
          title: 'Success',
          description: data.message || 'Password changed successfully!',
        });
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Failed to change password',
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      <UserHeader userName={user?.fullName} />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Button */}
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6 text-gray-600 hover:text-blue-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <Lock className="w-8 h-8 text-blue-900" />
          </div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Change Password</h1>
          <p className="text-gray-600">Update your account password for better security</p>
        </div>

        {/* Card */}
        <Card className="border-2 border-blue-200 shadow-lg">
          {!success ? (
            <>
              <CardHeader>
                <CardTitle className="text-blue-900 text-center">
                  Enter New Password
                </CardTitle>
                <CardDescription className="text-center">
                  For your security, please enter your current password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-blue-900 font-medium">
                      Current Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        placeholder="Enter current password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="pl-10 h-12 border-gray-300 focus:border-blue-900"
                        required
                      />
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-blue-900 font-medium">
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        placeholder="Enter new password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="pl-10 h-12 border-gray-300 focus:border-blue-900"
                        required
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      Password must be at least 8 characters long
                    </p>
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-blue-900 font-medium">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="pl-10 h-12 border-gray-300 focus:border-blue-900"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white font-semibold text-base"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Changing Password...
                      </>
                    ) : (
                      'Change Password'
                    )}
                  </Button>
                </form>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-900 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">Password Tips</p>
                      <ul className="space-y-1 text-blue-800">
                        <li>• Use at least 8 characters</li>
                        <li>• Include a mix of letters, numbers, and symbols</li>
                        <li>• Avoid using common words or personal information</li>
                        <li>• Don't reuse passwords from other sites</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            // Success State
            <>
              <CardHeader>
                <CardTitle className="text-blue-900 text-center">
                  Password Changed Successfully
                </CardTitle>
                <CardDescription className="text-center">
                  Your password has been updated. You will be redirected to the dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <p className="text-gray-600 mb-6">
                    Your password has been successfully changed. Please use your new password for future logins.
                  </p>
                  <Link href="/dashboard">
                    <Button className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-semibold">
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </main>

      <Footer />
    </div>
  );
}
