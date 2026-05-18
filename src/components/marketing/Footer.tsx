'use client';

import React, { type CSSProperties } from 'react';
import Link from 'next/link';
import { Sparkles, Globe, Briefcase, Code, Mail, ArrowUpRight } from 'lucide-react';
import { colors, gradients, typography, semantic, borderRadius } from '@/styles/theme';

const footerLinks = {
  Product: [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Enterprise', href: '/enterprise' },
    { label: 'Integrations', href: '/integrations' },
    { label: 'Security', href: '/security' },
    { label: 'Changelog', href: '/blog' },
  ],
  Resources: [
    { label: 'Documentation', href: '/docs' },
    { label: 'Blog', href: '/blog' },
    { label: 'API Reference', href: '/docs' },
    { label: 'Help Center', href: '/contact' },
    { label: 'Status', href: '#' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Careers', href: '#' },
    { label: 'Press Kit', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'GDPR', href: '#' },
  ],
};

export default function Footer() {
  const footerStyle: CSSProperties = {
    borderTop: `1px solid ${semantic.border.subtle}`,
    background: semantic.bg.primary,
    padding: '4rem 0 2rem',
  };

  const containerStyle: CSSProperties = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1.5rem',
  };

  const topSectionStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '2.5rem',
    marginBottom: '3rem',
  };

  const brandSectionStyle: CSSProperties = {
    gridColumn: 'span 1',
  };

  const logoStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.lg,
    color: semantic.text.primary,
    marginBottom: '1rem',
  };

  const logoIconStyle: CSSProperties = {
    width: 28,
    height: 28,
    borderRadius: borderRadius.md,
    background: gradients.brand,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const descStyle: CSSProperties = {
    fontSize: typography.fontSize.sm,
    color: semantic.text.muted,
    lineHeight: 1.6,
    marginBottom: '1.5rem',
    maxWidth: '280px',
  };

  const socialContainerStyle: CSSProperties = {
    display: 'flex',
    gap: '0.75rem',
  };

  const socialStyle: CSSProperties = {
    width: 36,
    height: 36,
    borderRadius: borderRadius.lg,
    background: semantic.bg.tertiary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: semantic.text.muted,
    transition: 'all 0.2s ease',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
  };

  const columnTitleStyle: CSSProperties = {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: semantic.text.primary,
    marginBottom: '1rem',
    letterSpacing: '0.02em',
  };

  const columnLinkStyle: CSSProperties = {
    display: 'block',
    fontSize: typography.fontSize.sm,
    color: semantic.text.muted,
    textDecoration: 'none',
    padding: '0.375rem 0',
    transition: 'color 0.15s ease',
  };

  const bottomStyle: CSSProperties = {
    borderTop: `1px solid ${semantic.border.subtle}`,
    paddingTop: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
  };

  const copyrightStyle: CSSProperties = {
    fontSize: typography.fontSize.sm,
    color: semantic.text.muted,
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={topSectionStyle}>
          {/* Brand Column */}
          <div style={brandSectionStyle}>
            <Link href="/" style={logoStyle}>
              <div style={logoIconStyle}>
                <Sparkles size={14} color="#fff" />
              </div>
              Sunave
            </Link>
            <p style={descStyle}>
              Enterprise AI meeting intelligence and dynamic documentation operating system.
            </p>
            <div style={socialContainerStyle}>
              <a href="#" style={socialStyle} aria-label="Globe"><Globe size={16} /></a>
              <a href="#" style={socialStyle} aria-label="LinkedIn"><Briefcase size={16} /></a>
              <a href="#" style={socialStyle} aria-label="GitHub"><Code size={16} /></a>
              <a href="mailto:hello@sunave.tech" style={socialStyle} aria-label="Email"><Mail size={16} /></a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 style={columnTitleStyle}>{title}</h3>
              {links.map((link) => (
                <Link key={link.label} href={link.href} style={columnLinkStyle}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div style={bottomStyle}>
          <p style={copyrightStyle}>
            © {new Date().getFullYear()} Sunave Technologies. All rights reserved.
          </p>
          <p style={copyrightStyle}>
            Made with ❤️ for enterprise teams
          </p>
        </div>
      </div>
    </footer>
  );
}
