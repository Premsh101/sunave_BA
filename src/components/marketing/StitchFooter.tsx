import React from 'react';
import Link from 'next/link';
import { AudioLines } from 'lucide-react';

const FOOTER_LINKS = [
  { href: '/security', label: 'Privacy Policy' },
  { href: '/security', label: 'Terms of Service' },
  { href: '/enterprise', label: 'Contact Support' },
  { href: '/integrations', label: 'Integrations' },
];

export default function StitchFooter() {
  return (
    <footer className="w-full py-16 glass-panel border-x-0 border-b-0 rounded-none relative z-20 bg-mk-bg/40">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center px-8 gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center border border-white/10">
            <AudioLines size={16} className="text-white" />
          </div>
          <span className="font-display text-2xl text-mk-fg">Sunave</span>
        </div>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-mk-secondary hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className="text-xs text-mk-secondary font-light">
          © {new Date().getFullYear()} Sunave AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
