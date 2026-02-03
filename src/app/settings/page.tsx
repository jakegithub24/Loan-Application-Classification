'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserHeader } from '@/components/layout/UserHeader';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, User, Lock, Trash2, AlertTriangle, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please type DELETE to confirm',
      });
      return;
    }

    setDeleting(true);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Please login to delete your account',
        });
        router.push('/login');
        return;
      }

      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Account Deleted',
          description: 'Your account has been deleted successfully',
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Failed to delete account',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred. Please try again.',
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      <UserHeader userName={user?.fullName} />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6 text-gray-600 hover:text-blue-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <Settings className="w-8 h-8 text-blue-900" />
          </div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid gap-6">
          {/* Account Information */}
          <Card className="border-2 border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
              <CardDescription>Your personal account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-500">Full Name</Label>
                  <p className="font-semibold text-gray-900">{user?.fullName || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Email Address</Label>
                  <p className="font-semibold text-gray-900">{user?.email || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Phone Number</Label>
                  <p className="font-semibold text-gray-900">{user?.phone || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="border-2 border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-blue-900">Account Actions</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/change-password" className="block">
                <Button variant="outline" className="w-full h-12 justify-start border-gray-300 hover:border-blue-900 hover:text-blue-900">
                  <Lock className="w-4 h-4 mr-3" />
                  Change Password
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-2 border-red-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-red-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </CardTitle>
              <CardDescription className="text-red-700">
                These actions are irreversible. Please proceed with caution.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Trash2 className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-900 mb-1">Delete Account</h3>
                    <p className="text-sm text-red-800 mb-3">
                      Permanently delete your account and all personal data. Your past loan applications will remain in the system for record-keeping purposes. This action cannot be undone.
                    </p>
                    <Button
                      variant="destructive"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete My Account
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-900 font-semibold mb-2">
                This will permanently delete:
              </p>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• Your account and personal information</li>
                <li>• Your login credentials</li>
                <li>• Your profile data</li>
              </ul>
              <p className="text-sm text-red-900 font-semibold mt-3 mb-2">
                This will NOT delete:
              </p>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• Your past loan applications (kept for records)</li>
                <li>• Admin access to your application history</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmText">Type DELETE to confirm</Label>
              <Input
                id="confirmText"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="border-red-300 focus:border-red-500"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setDeleteConfirmText('');
              }}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleting || deleteConfirmText !== 'DELETE'}
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
