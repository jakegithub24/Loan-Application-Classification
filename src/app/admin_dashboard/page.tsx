'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  LogOut, 
  Search, 
  Loader2,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [admin, setAdmin] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [decisionNote, setDecisionNote] = useState('');

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('admin');

    if (!adminToken || !adminData) {
      router.push('/admin_login');
      return;
    }

    setAdmin(JSON.parse(adminData));
    fetchApplications(adminToken);
  }, [router]);

  const fetchApplications = async (token: string) => {
    try {
      const response = await fetch('/api/loan/applications', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
        setFilteredApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load applications',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = applications.filter((app) => {
      const matchesStatus = statusFilter === 'all' || app.approvalStatus === statusFilter;
      const matchesSearch =
        searchTerm === '' ||
        app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
    setFilteredApplications(filtered);
  }, [applications, statusFilter, searchTerm]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    router.push('/admin_login');
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

  const openDetailModal = (application: any) => {
    setSelectedApp(application);
    setNewStatus(application.approvalStatus);
    setDecisionNote(application.approvalReason || '');
    setDetailModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedApp) return;

    setUpdatingStatus(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`/api/loan/${selectedApp.id}/update-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          approvalStatus: newStatus,
          approvalReason: decisionNote,
          reviewedBy: admin?.username,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Status updated successfully!',
        });
        setDetailModalOpen(false);
        
        const adminToken = localStorage.getItem('adminToken');
        if (adminToken) fetchApplications(adminToken);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Failed to update status',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred. Please try again.',
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <h1 className="text-lg font-bold">SecureLoan Admin</h1>
                <p className="text-xs text-blue-200">Welcome, {admin?.fullName}</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Applications</CardTitle>
              <FileText className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{applications.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
              <Clock className="w-4 h-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {applications.filter((a) => a.approvalStatus === 'pending').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {applications.filter((a) => a.approvalStatus === 'approved').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
              <XCircle className="w-4 h-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {applications.filter((a) => a.approvalStatus === 'rejected').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-blue-900">Applications Management</CardTitle>
            <CardDescription>View and manage all loan applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="sr-only">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by name, email, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Label htmlFor="status" className="sr-only">Status Filter</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status" className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={() => {
                    const adminToken = localStorage.getItem('adminToken');
                    if (adminToken) fetchApplications(adminToken);
                  }}
                  variant="outline"
                  className="h-12"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-blue-900">Applications ({filteredApplications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-900" />
                <p className="mt-4 text-gray-600">Loading applications...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No applications found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Applicant</TableHead>
                      <TableHead className="hidden sm:table-cell">Amount</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Date</TableHead>
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
                          <div className="text-sm text-gray-500">{app.applicantEmail}</div>
                        </TableCell>
                        <TableCell className="font-semibold hidden sm:table-cell">
                          ${app.loanAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{app.loanType}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${
                            app.riskLevel === 'low' ? 'bg-green-500' :
                            app.riskLevel === 'medium' ? 'bg-yellow-500' :
                            'bg-red-500'
                          } text-white`}>
                            {app.riskLevel?.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(app.approvalStatus)}</TableCell>
                        <TableCell className="text-sm hidden sm:table-cell">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDetailModal(app)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">View</span>
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
      </main>

      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>Review application and update status</DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Applicant Name</Label>
                  <p className="font-semibold">{selectedApp.applicantName}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Email</Label>
                  <p className="font-semibold">{selectedApp.applicantEmail}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Phone</Label>
                  <p className="font-semibold">{selectedApp.applicantPhone}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Application ID</Label>
                  <p className="font-mono text-sm">{selectedApp.id}</p>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Loan Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-500">Loan Amount</Label>
                    <p className="font-semibold text-lg">${selectedApp.loanAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Loan Type</Label>
                    <p className="font-semibold">{selectedApp.loanType.toUpperCase()}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm text-gray-500">Purpose</Label>
                    <p className="font-semibold">{selectedApp.loanPurpose}</p>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Risk Assessment</h4>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label className="text-sm text-gray-500">Risk Level</Label>
                    <div>{getStatusBadge(selectedApp.riskLevel)}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Risk Score</Label>
                    <p className="font-semibold text-lg">{selectedApp.riskScore}/100</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Current Status</Label>
                    <div>{getStatusBadge(selectedApp.approvalStatus)}</div>
                  </div>
                </div>
                {selectedApp.aiAnalysis && (
                  <div>
                    <Label className="text-sm text-gray-500">AI Analysis</Label>
                    <p className="text-sm bg-gray-50 p-3 rounded mt-1">{selectedApp.aiAnalysis}</p>
                  </div>
                )}
              </div>

              <div className="border rounded-lg p-4 bg-blue-50">
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
                  <Button
                    onClick={handleStatusUpdate}
                    disabled={updatingStatus || newStatus === selectedApp.approvalStatus}
                    className="w-full"
                  >
                    {updatingStatus ? 'Updating...' : 'Update Status'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
