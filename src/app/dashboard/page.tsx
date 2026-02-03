'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserHeader } from '@/components/layout/UserHeader';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Plus, Activity } from 'lucide-react';

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchApplications(token);
  }, [router]);

  const fetchApplications = async (token: string) => {
    try {
      const response = await fetch('/api/loan/user/applications', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, any> = {
      pending: { color: 'bg-yellow-500', icon: Clock },
      approved: { color: 'bg-green-500', icon: CheckCircle },
      rejected: { color: 'bg-red-500', icon: XCircle },
      under_review: { color: 'bg-blue-500', icon: AlertCircle },
    };
    const style = styles[status] || styles.pending;
    const Icon = style.icon;
    return (
      <Badge className={`${style.color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      <UserHeader userName={user?.fullName} />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            Welcome back, {user?.fullName?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600">Manage your loan applications and track their status.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-blue-900" />
                </div>
                <div>
                  <CardTitle className="text-blue-900">New Application</CardTitle>
                  <CardDescription>Apply for a new loan</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/application">
                <Button className="w-full bg-blue-900 hover:bg-blue-800">
                  Start Application
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-900" />
                </div>
                <div>
                  <CardTitle className="text-blue-900">Application Status</CardTitle>
                  <CardDescription>Track your loan applications</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/status">
                <Button variant="outline" className="w-full border-blue-900 text-blue-900 hover:bg-blue-50">
                  View Status
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-900">Your Applications</CardTitle>
            <CardDescription>Track the status of your loan applications</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-4">You haven't submitted any applications yet.</p>
                <Link href="/application">
                  <Button className="bg-blue-900 hover:bg-blue-800">
                    <Plus className="w-4 h-4 mr-2" />
                    Apply for Loan
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-blue-900">
                            {app.loanType.charAt(0).toUpperCase() + app.loanType.slice(1)} Loan
                          </h3>
                          {getStatusBadge(app.approvalStatus)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="text-gray-500">Amount:</span>{' '}
                            <span className="font-medium text-gray-900">
                              ${app.loanAmount.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Applied:</span>{' '}
                            <span className="font-medium text-gray-900">
                              {new Date(app.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Risk:</span>{' '}
                            <span className="font-medium text-gray-900">
                              {app.riskLevel.charAt(0).toUpperCase() + app.riskLevel.slice(1)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Score:</span>{' '}
                            <span className="font-medium text-gray-900">
                              {app.riskScore}/100
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link href={`/status?id=${app.id}`}>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
