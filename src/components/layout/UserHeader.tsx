'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Building2, LayoutDashboard, FileText, Activity, LogOut, Lock, Menu, X, Settings } from 'lucide-react';

interface UserHeaderProps {
  userName?: string;
}

export function UserHeader({ userName }: UserHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/application', icon: FileText, label: 'Apply for Loan' },
    { href: '/status', icon: Activity, label: 'Application Status' },
  ];

  return (
    <header className="border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-blue-900">SecureLoan</h1>
              <p className="text-xs text-gray-500">Welcome, {userName || 'User'}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={isActive(link.href) ? 'default' : 'ghost'}
                    className={
                      isActive(link.href)
                        ? 'bg-blue-900'
                        : 'text-gray-600 hover:text-blue-900'
                    }
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/settings">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-blue-900"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t py-4 space-y-3">
            <div className="mb-3 px-2">
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Welcome, {userName || 'User'}
              </p>
              <p className="text-xs text-gray-500">SecureLoan Portal</p>
            </div>
            
            <nav className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2 rounded-lg transition-colors ${
                      isActive(link.href)
                        ? 'bg-blue-900 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }"
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="text-base">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t pt-3 space-y-2">
              <Link
                href="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Settings className="w-5 h-5 mr-3" />
                <span className="text-base">Settings</span>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span className="text-base">Logout</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
