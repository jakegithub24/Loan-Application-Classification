'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, ShieldCheck, TrendingUp, Clock, Users, Award, ArrowRight, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-900">SecureLoan</h1>
                <p className="text-xs text-gray-500">Trusted Banking Solutions</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#" className="text-gray-600 hover:text-blue-900 transition-colors font-medium">
                Home
              </Link>
              <Link href="#services" className="text-gray-600 hover:text-blue-900 transition-colors font-medium">
                Services
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-blue-900 transition-colors font-medium">
                About Us
              </Link>
              <Link href="#contact" className="text-gray-600 hover:text-blue-900 transition-colors font-medium">
                Contact
              </Link>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-blue-900 hover:text-blue-900 hover:bg-blue-50">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white">
                  Register Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-blue-800/50 px-4 py-2 rounded-full mb-6">
              <Award className="w-4 h-4 mr-2 text-yellow-400" />
              <span className="text-sm font-medium text-blue-100">Trusted by 10,000+ Customers</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Your Dreams, <span className="text-yellow-400">Our Commitment</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Fast, secure, and transparent loan solutions tailored to your needs. Apply online and get approved within minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-semibold text-lg px-8 py-6">
                  Apply for Loan
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#services">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-900 font-semibold text-lg px-8 py-6">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">98%</div>
                <div className="text-blue-200 text-sm">Approval Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">24hrs</div>
                <div className="text-blue-200 text-sm">Quick Approval</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">0%</div>
                <div className="text-blue-200 text-sm">Hidden Fees</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">24/7</div>
                <div className="text-blue-200 text-sm">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Our Loan Services</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We offer a wide range of loan products designed to meet your financial needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <Building2 className="w-8 h-8" />,
                title: 'Home Loans',
                description: 'Achieve your dream of homeownership with our competitive mortgage rates and flexible terms.',
                features: ['Low interest rates', 'Flexible repayment', 'Quick processing'],
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Business Loans',
                description: 'Grow your business with our tailored financing solutions for startups and established enterprises.',
                features: ['Competitive rates', 'Quick approval', 'Expert guidance'],
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Personal Loans',
                description: 'Get funds for your personal needs with our easy application process and fast disbursement.',
                features: ['No collateral', 'Flexible tenure', 'Easy EMI options'],
              },
              {
                icon: <ShieldCheck className="w-8 h-8" />,
                title: 'Education Loans',
                description: 'Invest in your future with our education loans designed for students and professionals.',
                features: ['Cover all expenses', 'Moratorium period', 'Tax benefits'],
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: 'Auto Loans',
                description: 'Drive your dream car home with our attractive auto loan options and quick approval.',
                features: ['Up to 100% financing', 'Quick disbursal', 'Competitive rates'],
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: 'Debt Consolidation',
                description: 'Simplify your finances by consolidating multiple debts into one manageable loan.',
                features: ['Single EMI', 'Lower interest', 'Better management'],
              },
            ].map((service, index) => (
              <Card key={index} className="border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-900 mb-4">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl text-blue-900">{service.title}</CardTitle>
                  <CardDescription className="text-gray-600">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
                  Why Choose SecureLoan?
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  We're committed to providing you with the best loan experience. Here's what sets us apart from the rest.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      title: 'AI-Powered Processing',
                      description: 'Our advanced AI system evaluates applications quickly and accurately, reducing wait times.',
                    },
                    {
                      title: 'Transparent Pricing',
                      description: 'No hidden fees or surprises. What you see is what you pay.',
                    },
                    {
                      title: '24/7 Customer Support',
                      description: 'Our dedicated team is always available to help you with any questions.',
                    },
                    {
                      title: 'Secure & Private',
                      description: 'Your data is protected with bank-level security and encryption.',
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-900 mb-1">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Start Your Application Today</h3>
                <p className="text-blue-100 mb-8">
                  Join thousands of satisfied customers who have made their dreams a reality with SecureLoan.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    'Quick online application',
                    'Instant eligibility check',
                    'Fast approval process',
                    'Competitive interest rates',
                    'Flexible repayment options',
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button size="lg" className="w-full bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-semibold">
                    Apply Now - It's Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Apply for a loan in minutes and get a decision within 24 hours. No paperwork, no hassle.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-semibold text-lg px-10 py-6">
              Start Your Application
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-900" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">SecureLoan</h3>
                  <p className="text-xs text-slate-400">Trusted Banking Solutions</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                Your trusted partner for all your financial needs. We make loans simple, fast, and accessible.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3 text-slate-400">
                <li><Link href="#" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="#services" className="hover:text-white transition-colors">Services</Link></li>
                <li><Link href="#about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Register</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-3 text-slate-400">
                <li><Link href="#" className="hover:text-white transition-colors">Home Loans</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Business Loans</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Personal Loans</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Education Loans</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Auto Loans</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li>123 Financial District</li>
                <li>New York, NY 10001</li>
                <li>support@secureloan.com</li>
                <li>+1 (800) 123-4567</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2024 SecureLoan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
