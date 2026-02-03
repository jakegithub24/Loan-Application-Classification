'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserHeader } from '@/components/layout/UserHeader';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Loader2, DollarSign, Briefcase, GraduationCap, Home, Car } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ApplicationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    loanAmount: '',
    loanPurpose: '',
    annualIncome: '',
    creditScore: '',
    employmentStatus: '',
    employmentDuration: '',
    monthlyDebt: '',
  });

  const loanPurposes = [
    { value: 'home_purchase', label: 'Home Purchase', icon: Home },
    { value: 'home_improvement', label: 'Home Improvement', icon: Home },
    { value: 'business', label: 'Business/Startup', icon: Briefcase },
    { value: 'education', label: 'Education', icon: GraduationCap },
    { value: 'auto', label: 'Vehicle Purchase', icon: Car },
    { value: 'personal', label: 'Personal Loan', icon: FileText },
    { value: 'debt_consolidation', label: 'Debt Consolidation', icon: DollarSign },
    { value: 'medical', label: 'Medical Expenses', icon: FileText },
    { value: 'other', label: 'Other', icon: FileText },
  ];

  const employmentStatuses = ['employed', 'self-employed', 'unemployed', 'retired', 'student'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Please login to submit an application',
        });
        router.push('/login');
        return;
      }

      const response = await fetch('/api/loan/user/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Application submitted successfully!',
        });
        setTimeout(() => {
          router.push('/status');
        }, 1500);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Failed to submit application',
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
      <UserHeader />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <FileText className="w-8 h-8 text-blue-900" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
            Loan Application
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fill in the details below to apply for a loan. Our AI-powered system will evaluate your application and provide a quick decision.
          </p>
        </div>

        {/* Application Form */}
        <Card className="border-2 border-blue-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-blue-900">Application Details</CardTitle>
            <CardDescription>
              Please provide accurate information for faster processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Loan Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Loan Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="loanPurpose" className="text-blue-900 font-medium">
                    Loan Purpose *
                  </Label>
                  <Select
                    value={formData.loanPurpose}
                    onValueChange={(value) => handleSelectChange('loanPurpose', value)}
                    required
                  >
                    <SelectTrigger className="h-12 border-gray-300 focus:border-blue-900">
                      <SelectValue placeholder="Select loan purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      {loanPurposes.map((purpose) => (
                        <SelectItem key={purpose.value} value={purpose.value}>
                          <div className="flex items-center gap-2">
                            <purpose.icon className="w-4 h-4" />
                            {purpose.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loanAmount" className="text-blue-900 font-medium">
                    Loan Amount ($) *
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="loanAmount"
                      name="loanAmount"
                      type="number"
                      placeholder="50000"
                      min="1000"
                      step="1000"
                      value={formData.loanAmount}
                      onChange={handleChange}
                      className="pl-10 h-12 border-gray-300 focus:border-blue-900"
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-500">Minimum loan amount: $1,000</p>
                </div>
              </div>

              {/* Financial Information */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Financial Information
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="annualIncome" className="text-blue-900 font-medium">
                      Annual Income ($) *
                    </Label>
                    <Input
                      id="annualIncome"
                      name="annualIncome"
                      type="number"
                      placeholder="75000"
                      min="0"
                      value={formData.annualIncome}
                      onChange={handleChange}
                      className="h-12 border-gray-300 focus:border-blue-900"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="creditScore" className="text-blue-900 font-medium">
                      Credit Score (300-850) *
                    </Label>
                    <Input
                      id="creditScore"
                      name="creditScore"
                      type="number"
                      placeholder="700"
                      min="300"
                      max="850"
                      value={formData.creditScore}
                      onChange={handleChange}
                      className="h-12 border-gray-300 focus:border-blue-900"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthlyDebt" className="text-blue-900 font-medium">
                      Monthly Debt Payments ($) *
                    </Label>
                    <Input
                      id="monthlyDebt"
                      name="monthlyDebt"
                      type="number"
                      placeholder="1500"
                      min="0"
                      value={formData.monthlyDebt}
                      onChange={handleChange}
                      className="h-12 border-gray-300 focus:border-blue-900"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Employment Information
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employmentStatus" className="text-blue-900 font-medium">
                      Employment Status *
                    </Label>
                    <Select
                      value={formData.employmentStatus}
                      onValueChange={(value) => handleSelectChange('employmentStatus', value)}
                      required
                    >
                      <SelectTrigger className="h-12 border-gray-300 focus:border-blue-900">
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
                    <Label htmlFor="employmentDuration" className="text-blue-900 font-medium">
                      Duration at Current Job (years)
                    </Label>
                    <Input
                      id="employmentDuration"
                      name="employmentDuration"
                      type="number"
                      placeholder="3"
                      min="0"
                      value={formData.employmentDuration}
                      onChange={handleChange}
                      className="h-12 border-gray-300 focus:border-blue-900"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white font-semibold text-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong className="block mb-1">What happens next?</strong>
                  After submission, our AI system will evaluate your application and provide a decision within 24-48 hours. You can track your application status in the dashboard.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
