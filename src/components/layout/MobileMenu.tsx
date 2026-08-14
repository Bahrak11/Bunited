"use client";

import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";
import Button from "@/components/ui/Button";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  if (!open) return null;

  return (
    <div className="lg:hidden border-t border-gray-100 bg-white">
      <nav className="flex flex-col px-4 py-4 gap-1">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-xl"
          >
            {link.label}
          </Link>
        ))}
        <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-gray-100">
          <Link href="/login" onClick={onClose}>
            <Button variant="secondary" className="w-full">Login</Button>
          </Link>
          <Link href="/apply" onClick={onClose}>
            <Button className="w-full">Apply Now</Button>
          </Link>
        </div>
      </nav>
    </div>
  );
}
