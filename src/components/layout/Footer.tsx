import { Building2, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
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
            <ul className="space-y-3 text-slate-400 text-sm">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Home Loans
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Business Loans
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Personal Loans
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Education Loans
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                123 Financial District, New York
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                support@secureloan.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                +1 (800) 123-4567
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} SecureLoan. All rights reserved. | Licensed under{' '}
            <a
              href="https://www.gnu.org/licenses/agpl-3.0.html"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
            >
              AGPL v3.0
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
