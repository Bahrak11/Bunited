import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { getWhatsAppLink } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold text-white">Bunited</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Your Gateway to Studying in Türkiye. Expert guidance for international students.
            </p>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">For Students</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/portal/dashboard" className="hover:text-white">Student Portal</Link></li>
              <li><Link href="/apply" className="hover:text-white">Apply Now</Link></li>
              <li><Link href="/scholarships" className="hover:text-white">Scholarships</Link></li>
              <li><Link href="/register" className="hover:text-white">Create Account</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-primary-light" />
                info@bunited.com
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-primary-light" />
                +90 555 123 4567
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-primary-light" />
                Istanbul, Türkiye
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Bunited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
