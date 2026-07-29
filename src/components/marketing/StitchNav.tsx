'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AudioLines, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/enterprise', label: 'Enterprise' },
  { href: '/security', label: 'Security' },
  { href: '/blog', label: 'Blog' },
];

export default function StitchNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/5 transition-all duration-300 ${
        scrolled ? 'bg-mk-bg/40 shadow-lg' : 'bg-mk-bg/20'
      }`}
    >
      <div className="flex justify-between items-center h-16 px-6 md:px-8 max-w-[1440px] mx-auto">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-mk-primary to-mk-primary-dark flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-shadow duration-300">
            <AudioLines size={18} className="text-white" />
          </div>
          <span className="font-display text-2xl text-mk-fg tracking-tight">Sunave</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'text-white border-b border-mk-primary pb-0.5'
                  : 'text-mk-secondary hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link
            href="/login"
            className="hidden md:block text-sm font-medium text-mk-fg hover:text-mk-primary transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium bg-mk-primary text-white px-5 py-2 rounded-lg glow-button"
          >
            Start Free
          </Link>
          <button
            className="md:hidden text-mk-fg"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-mk-bg/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`text-sm font-medium ${
                pathname === link.href ? 'text-white' : 'text-mk-secondary'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-mk-fg">
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
