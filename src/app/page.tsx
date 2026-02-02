'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { FileText, CheckCircle, XCircle, Clock, AlertCircle, Eye } from 'lucide-react';

interface LoanApplication {
  id: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  loanAmount: number;
  loanType: string;
  loanPurpose: string;
  annualIncome: number;
  creditScore: number;
  employmentStatus: string;
  employmentDuration?: number | null;
  monthlyDebt: number;
  riskLevel: string;
  approvalStatus: string;
  riskScore: number;
  debtToIncomeRatio: number;
  createdAt: string;
  aiAnalysis?: string;
  approvalReason?: string;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
}

interface FormData {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  loanAmount: string;
  loanPurpose: string;
  annualIncome: string;
  creditScore: string;
  employmentStatus: string;
  employmentDuration: string;
  monthlyDebt: string;
}

const employmentStatuses = ['employed', 'self-employed', 'unemployed', 'retired', 'student'];
const statusFilters = ['all', 'pending', 'approved', 'rejected', 'under_review'];

export default function LoanApplicationPage() {
  const [activeTab, setActiveTab] = useState('apply');
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [decisionNote, setDecisionNote] = useState('');

  const [formData, setFormData] = useState<FormData>({
    applicantName: '',
    applicantEmail: '',
    applicantPhone: '',
    loanAmount: '',
    loanPurpose: '',
    annualIncome: '',
    creditScore: '',
    employmentStatus: '',
    employmentDuration: '',
    monthlyDebt: '',
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/loan/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Application submitted successfully!');
        setFormData({
          applicantName: '',
          applicantEmail: '',
          applicantPhone: '',
          loanAmount: '',
          loanPurpose: '',
          annualIncome: '',
          creditScore: '',
          employmentStatus: '',
          employmentDuration: '',
          monthlyDebt: '',
        });
        setActiveTab('dashboard');
        fetchApplications();
      } else {
        toast.error(data.error || 'Failed to submit application');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/loan/applications');
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'dashboard' && applications.length === 0) {
      fetchApplications();
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === 'all' || app.approvalStatus === statusFilter;
    const matchesSearch =
      searchTerm === '' ||
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { color: string; icon: any }> = {
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

  const getRiskBadge = (level: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-500',
      medium: 'bg-yellow-500',
      high: 'bg-red-500',
    };
    return (
      <Badge className={`${colors[level] || 'bg-gray-500'} text-white`}>
        {level?.toUpperCase()}
      </Badge>
    );
  };

  const openDetailModal = (application: LoanApplication) => {
    setSelectedApp(application);
    setNewStatus(application.approvalStatus);
    setDecisionNote(application.approvalReason || '');
    setDetailModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedApp) return;

    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/loan/${selectedApp.id}/update-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approvalStatus: newStatus,
          approvalReason: decisionNote,
          reviewedBy: 'Admin',
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Status updated successfully!');
        setDetailModalOpen(false);
        fetchApplications();
      } else {
        toast.error(data.error || 'Failed to update status');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-xl">
              <FileText className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Loan Application System</h1>
              <p className="text-muted-foreground mt-1">AI-Powered Classification & Approval</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="apply">New Application</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>

          {/* Application Form Tab */}
          <TabsContent value="apply" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Loan Application Form</CardTitle>
                <CardDescription>
                  Fill in your details below. Our AI will classify and evaluate your application.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={formData.applicantName}
                          onChange={(e) => handleInputChange('applicantName', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.applicantEmail}
                          onChange={(e) => handleInputChange('applicantEmail', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 234 567 8900"
                          value={formData.applicantPhone}
                          onChange={(e) => handleInputChange('applicantPhone', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Loan Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Loan Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="loanAmount">Loan Amount ($) *</Label>
                        <Input
                          id="loanAmount"
                          type="number"
                          placeholder="50000"
                          min="1000"
                          value={formData.loanAmount}
                          onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="purpose">Loan Purpose *</Label>
                        <Input
                          id="purpose"
                          placeholder="e.g., Home purchase, Business startup, Education"
                          value={formData.loanPurpose}
                          onChange={(e) => handleInputChange('loanPurpose', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Financial Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Financial Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="income">Annual Income ($) *</Label>
                        <Input
                          id="income"
                          type="number"
                          placeholder="75000"
                          min="0"
                          value={formData.annualIncome}
                          onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="creditScore">Credit Score (300-850) *</Label>
                        <Input
                          id="creditScore"
                          type="number"
                          placeholder="700"
                          min="300"
                          max="850"
                          value={formData.creditScore}
                          onChange={(e) => handleInputChange('creditScore', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="monthlyDebt">Monthly Debt Payments ($) *</Label>
                        <Input
                          id="monthlyDebt"
                          type="number"
                          placeholder="1500"
                          min="0"
                          value={formData.monthlyDebt}
                          onChange={(e) => handleInputChange('monthlyDebt', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Employment Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Employment Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="employmentStatus">Employment Status *</Label>
                        <Select
                          value={formData.employmentStatus}
                          onValueChange={(value) => handleInputChange('employmentStatus', value)}
                          required
                        >
                          <SelectTrigger id="employmentStatus">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {employmentStatuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="employmentDuration">Duration at Current Job (years)</Label>
                        <Input
                          id="employmentDuration"
                          type="number"
                          placeholder="3"
                          min="0"
                          value={formData.employmentDuration}
                          onChange={(e) => handleInputChange('employmentDuration', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? 'Processing...' : 'Submit Application'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-8">
            <div className="space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Application Dashboard</CardTitle>
                  <CardDescription>View and manage all loan applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <Label htmlFor="search">Search</Label>
                      <Input
                        id="search"
                        placeholder="Search by name, email, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="md:w-48">
                      <Label htmlFor="status">Status Filter</Label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger id="status" className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusFilters.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.replace('_', ' ').toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button onClick={fetchApplications} variant="outline">
                        Refresh
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Applications Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Applications ({filteredApplications.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredApplications.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No applications found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Applicant</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Risk</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredApplications.map((app) => (
                            <TableRow key={app.id}>
                              <TableCell className="font-mono text-xs">
                                {app.id.slice(0, 8)}...
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">{app.applicantName}</div>
                                <div className="text-sm text-muted-foreground">{app.applicantEmail}</div>
                              </TableCell>
                              <TableCell className="font-semibold">${app.loanAmount.toLocaleString()}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{app.loanType}</Badge>
                              </TableCell>
                              <TableCell>{getRiskBadge(app.riskLevel)}</TableCell>
                              <TableCell>{getStatusBadge(app.approvalStatus)}</TableCell>
                              <TableCell className="text-sm">
                                {new Date(app.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openDetailModal(app)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Detail Modal */}
        <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>
                Review application information and update status if needed
              </DialogDescription>
            </DialogHeader>

            {selectedApp && (
              <div className="space-y-6">
                {/* Applicant Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Applicant Name</Label>
                    <p className="font-semibold">{selectedApp.applicantName}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Email</Label>
                    <p className="font-semibold">{selectedApp.applicantEmail}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Phone</Label>
                    <p className="font-semibold">{selectedApp.applicantPhone}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Application ID</Label>
                    <p className="font-mono text-sm">{selectedApp.id}</p>
                  </div>
                </div>

                {/* Loan Information */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Loan Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Loan Amount</Label>
                      <p className="font-semibold text-lg">${selectedApp.loanAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Loan Type</Label>
                      <p className="font-semibold">{selectedApp.loanType.toUpperCase()}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-sm text-muted-foreground">Purpose</Label>
                      <p className="font-semibold">{selectedApp.loanPurpose}</p>
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Financial Information</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Annual Income</Label>
                      <p className="font-semibold">${selectedApp.annualIncome.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Monthly Debt</Label>
                      <p className="font-semibold">${selectedApp.monthlyDebt.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">DTI Ratio</Label>
                      <p className="font-semibold">{selectedApp.debtToIncomeRatio.toFixed(1)}%</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Credit Score</Label>
                      <p className="font-semibold">{selectedApp.creditScore}</p>
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Risk Assessment</h4>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Risk Level</Label>
                      <div>{getRiskBadge(selectedApp.riskLevel)}</div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Risk Score</Label>
                      <p className="font-semibold text-lg">{selectedApp.riskScore}/100</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Current Status</Label>
                      <div>{getStatusBadge(selectedApp.approvalStatus)}</div>
                    </div>
                  </div>
                  {selectedApp.aiAnalysis && (
                    <div>
                      <Label className="text-sm text-muted-foreground">AI Analysis</Label>
                      <p className="text-sm bg-muted p-3 rounded mt-1">{selectedApp.aiAnalysis}</p>
                    </div>
                  )}
                </div>

                {/* Employment Info */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Employment Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Employment Status</Label>
                      <p className="font-semibold">{selectedApp.employmentStatus.charAt(0).toUpperCase() + selectedApp.employmentStatus.slice(1)}</p>
                    </div>
                    {selectedApp.employmentDuration && (
                      <div>
                        <Label className="text-sm text-muted-foreground">Duration</Label>
                        <p className="font-semibold">{selectedApp.employmentDuration} years</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Update Section */}
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h4 className="font-semibold mb-3">Update Status</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="newStatus">New Status</Label>
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger id="newStatus">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="under_review">Under Review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="decisionNote">Decision Notes</Label>
                      <Textarea
                        id="decisionNote"
                        placeholder="Add notes explaining your decision..."
                        value={decisionNote}
                        onChange={(e) => setDecisionNote(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleStatusUpdate}
                        disabled={updatingStatus || newStatus === selectedApp.approvalStatus}
                        className="flex-1"
                      >
                        {updatingStatus ? 'Updating...' : 'Update Status'}
                      </Button>
                      {selectedApp.reviewedBy && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>Reviewed by: {selectedApp.reviewedBy}</span>
                          {selectedApp.reviewedAt && (
                            <span className="ml-2">
                              on {new Date(selectedApp.reviewedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
