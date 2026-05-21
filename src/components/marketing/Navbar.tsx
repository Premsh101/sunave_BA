'use client';

import React, { useState, useEffect, type CSSProperties } from 'react';
import Link from 'next/link';
import { Menu, X, Mic, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';
import ThemeSelector from '@/components/ui/ThemeSelector';
import { gradients, borderRadius, typography, transitions, shadows, semantic, zIndex } from '@/styles/theme';

const navLinks = [
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Security', href: '/security' },
  { label: 'Blog', href: '/blog' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: zIndex.sticky,
    padding: scrolled ? '0.75rem 0' : '1rem 0',
    background: scrolled ? 'var(--bg-nav-scrolled)' : 'transparent',
    backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
    WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
    borderBottom: scrolled ? `1px solid ${semantic.border.subtle}` : '1px solid transparent',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const containerStyle: CSSProperties = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const logoStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.xl,
    color: semantic.text.primary,
    letterSpacing: typography.letterSpacing.tight,
  };

  const logoIconStyle: CSSProperties = {
    width: 32,
    height: 32,
    borderRadius: borderRadius.lg,
    background: gradients.brand,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.glow,
  };
  const linksContainerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  };

  const linkStyle: CSSProperties = {
    padding: '0.5rem 0.875rem',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: semantic.text.tertiary,
    textDecoration: 'none',
    borderRadius: borderRadius.lg,
    transition: transitions.fast,
  };

  const ctaContainerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const mobileMenuBtnStyle: CSSProperties = {
    display: 'none',
    background: 'none',
    border: 'none',
    color: semantic.text.primary,
    cursor: 'pointer',
    padding: '0.5rem',
  };

  const mobileOverlayStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'var(--bg-mobile-menu)',
    backdropFilter: 'blur(20px)',
    zIndex: zIndex.overlay,
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem',
    animation: 'fadeIn 0.2s ease',
  };

  const mobileHeaderStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '2rem',
  };

  const mobileLinkStyle: CSSProperties = {
    display: 'block',
    padding: '1rem 0',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: semantic.text.secondary,
    textDecoration: 'none',
    borderBottom: `1px solid ${semantic.border.subtle}`,
    transition: transitions.fast,
  };

  return (
    <>
      <nav style={navStyle} id="main-navbar">
        <div style={containerStyle}>
          <Link href="/" style={logoStyle}>
            <div style={logoIconStyle}>
              <Mic size={16} color="#fff" />
            </div>
            Sunave
          </Link>

          {/* Desktop Links */}
          <div style={linksContainerStyle} className="desktop-nav-links">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} style={linkStyle} className="nav-link">
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div style={ctaContainerStyle} className="desktop-nav-cta">
            <ThemeSelector />
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary" size="sm" icon={<Zap size={14} />}>
                Start Free
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            style={mobileMenuBtnStyle}
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={mobileOverlayStyle}>
          <div style={mobileHeaderStyle}>
            <Link href="/" style={logoStyle} onClick={() => setMobileOpen(false)}>
              <div style={logoIconStyle}>
                <Mic size={16} color="#fff" />
              </div>
              Sunave
            </Link>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <ThemeSelector />
              <button
                style={{ ...mobileMenuBtnStyle, display: 'flex' }}
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
          </div>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} style={mobileLinkStyle} onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              <Button variant="secondary" fullWidth>Log in</Button>
            </Link>
            <Link href="/signup" onClick={() => setMobileOpen(false)}>
              <Button variant="primary" fullWidth icon={<Zap size={14} />}>Start Free</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Responsive + hover styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav-links { display: none !important; }
          .desktop-nav-cta { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        .nav-link:hover {
          color: var(--text-primary) !important;
          background: var(--bg-surface) !important;
        }
      `}</style>
    </>
  );
}
