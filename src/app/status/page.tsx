'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { UserHeader } from '@/components/layout/UserHeader';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck,
  ArrowLeft,
  Calendar,
  User,
  Mail,
  Phone
} from 'lucide-react';

export default function StatusPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));

    // Fetch application from URL params or get latest
    const appId = searchParams.get('id');
    fetchApplication(token, appId);
  }, [router, searchParams]);

  const fetchApplication = async (token: string, appId?: string | null) => {
    try {
      let url = '/api/loan/user/applications';
      if (appId) {
        url = `/api/loan/user/applications?id=${appId}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const apps = data.applications || [];
        
        if (appId) {
          const app = apps.find((a: any) => a.id === appId);
          setApplication(app || null);
        } else if (apps.length > 0) {
          setApplication(apps[0]); // Show most recent
        }
      }
    } catch (error) {
      console.error('Failed to fetch application:', error);
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
      <Badge className={`${style.color} text-white px-4 py-2 text-sm`}>
        <Icon className="w-4 h-4 mr-2" />
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getRiskBadge = (level: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-500',
      medium: 'bg-yellow-500',
      high: 'bg-red-500',
    };
    return (
      <Badge className={`${colors[level] || 'bg-gray-500'} text-white px-4 py-2 text-sm`}>
        {level?.toUpperCase()} RISK
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
        <UserHeader userName={user?.fullName} />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading application status...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
        <UserHeader userName={user?.fullName} />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
          <Card className="border-2 border-gray-200">
            <CardContent className="text-center py-16">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Application Found</h2>
              <p className="text-gray-600 mb-6">You haven't submitted any loan applications yet.</p>
              <Link href="/application">
                <Button className="bg-blue-900 hover:bg-blue-800">
                  <FileText className="w-4 h-4 mr-2" />
                  Apply for Loan
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

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
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
            Application Status
          </h1>
          <p className="text-gray-600">
            Application ID: <span className="font-mono font-medium text-blue-900">{application.id.slice(0, 8)}...</span>
          </p>
        </div>

        {/* Status Card */}
        <Card className="border-2 border-blue-200 shadow-lg mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl text-blue-900 mb-2">
                  {application.loanType.charAt(0).toUpperCase() + application.loanType.slice(1)} Loan
                </CardTitle>
                <CardDescription>Submitted on {new Date(application.createdAt).toLocaleDateString()}</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                {getStatusBadge(application.approvalStatus)}
                {getRiskBadge(application.riskLevel)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Loan Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-blue-900" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Loan Amount</p>
                    <p className="text-2xl font-bold text-blue-900">
                      ${application.loanAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Risk Score</p>
                    <p className="text-2xl font-bold text-green-700">
                      {application.riskScore}/100
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-purple-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Debt-to-Income Ratio</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {application.debtToIncomeRatio.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-yellow-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Application Date</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Applicant Information */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Applicant Information</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{application.applicantName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{application.applicantEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{application.applicantPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            {application.aiAnalysis && (
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  AI Analysis
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900">{application.aiAnalysis}</p>
                </div>
              </div>
            )}

            {/* Approval Reason */}
            {application.approvalReason && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  Decision Details
                </h3>
                <div className={`p-4 rounded-lg ${
                  application.approvalStatus === 'approved' 
                    ? 'bg-green-50 border border-green-200' 
                    : application.approvalStatus === 'rejected'
                    ? 'bg-red-50 border border-red-200'
                    : 'bg-blue-50 border border-blue-200'
                }`}>
                  <p className={`${
                    application.approvalStatus === 'approved'
                      ? 'text-green-900'
                      : application.approvalStatus === 'rejected'
                      ? 'text-red-900'
                      : 'text-blue-900'
                  }`}>
                    {application.approvalReason}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/application" className="flex-1">
            <Button className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-semibold">
              <FileText className="w-4 h-4 mr-2" />
              Apply for Another Loan
            </Button>
          </Link>
          <Link href="/dashboard" className="flex-1">
            <Button variant="outline" className="w-full h-12 border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold">
              View All Applications
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
