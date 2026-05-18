'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Video, 
  FileText, 
  LayoutTemplate, 
  MessageSquare, 
  Settings, 
  CreditCard,
  LogOut,
  Sparkles,
  Search,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { colors, typography, semantic, transitions, zIndex } from '@/styles/theme';

const sidebarLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/meetings', label: 'Meetings', icon: Video },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/template-studio', label: 'Template Studio', icon: LayoutTemplate },
  { href: '/prompt-studio', label: 'Prompt Studio', icon: MessageSquare },
];

const bottomLinks = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/billing', label: 'Billing', icon: CreditCard },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const SIDEBAR_WIDTH = 260;
  const HEADER_HEIGHT = 64;

  const sidebarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    background: semantic.bg.secondary,
    borderRight: `1px solid ${semantic.border.primary}`,
    display: 'flex',
    flexDirection: 'column',
    zIndex: zIndex.sticky,
    transition: transitions.transform,
    transform: 'translateX(0)',
  };

  const mobileSidebarStyle: React.CSSProperties = {
    ...sidebarStyle,
    transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
    zIndex: zIndex.modal,
  };

  const headerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: SIDEBAR_WIDTH,
    right: 0,
    height: HEADER_HEIGHT,
    background: semantic.bg.primary,
    borderBottom: `1px solid ${semantic.border.primary}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 1.5rem',
    zIndex: zIndex.sticky - 1,
    backdropFilter: 'blur(12px)',
  };

  const mobileHeaderStyle: React.CSSProperties = {
    ...headerStyle,
    left: 0,
    padding: '0 1rem',
  };

  const mainStyle: React.CSSProperties = {
    paddingTop: HEADER_HEIGHT,
    paddingLeft: SIDEBAR_WIDTH,
    minHeight: '100vh',
    background: semantic.bg.primary,
  };

  const mobileMainStyle: React.CSSProperties = {
    ...mainStyle,
    paddingLeft: 0,
  };

  const linkStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.625rem 0.75rem',
    borderRadius: '8px',
    fontSize: typography.fontSize.sm,
    fontWeight: active ? 500 : 400,
    color: active ? semantic.text.brand : semantic.text.secondary,
    background: active ? semantic.bg.brandSubtle : 'transparent',
    textDecoration: 'none',
    transition: transitions.fast,
    margin: '0.25rem 1rem',
  });

  const renderSidebar = (style: React.CSSProperties) => (
    <aside style={style} className="sidebar-container">
      <div style={{ height: HEADER_HEIGHT, display: 'flex', alignItems: 'center', padding: '0 1.5rem', borderBottom: `1px solid ${semantic.border.primary}` }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: semantic.text.primary, fontWeight: 600 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: `linear-gradient(135deg, ${colors.brand[500]}, ${colors.accent[500]})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={12} color="#fff" />
          </div>
          Sunave
        </Link>
        <button className="mobile-close-btn" style={{ marginLeft: 'auto', background: 'none', border: 'none', color: semantic.text.muted }} onClick={() => setMobileMenuOpen(false)}>
          <X size={20} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 0' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: semantic.text.muted, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 1.5rem', marginBottom: '0.5rem' }}>
          Menu
        </div>
        {sidebarLinks.map((link) => (
          <Link key={link.href} href={link.href} style={linkStyle(pathname?.startsWith(link.href) || false)} onClick={() => setMobileMenuOpen(false)}>
            <link.icon size={18} />
            {link.label}
          </Link>
        ))}

        <div style={{ fontSize: '11px', fontWeight: 600, color: semantic.text.muted, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 1.5rem', marginTop: '2rem', marginBottom: '0.5rem' }}>
          Preferences
        </div>
        {bottomLinks.map((link) => (
          <Link key={link.href} href={link.href} style={linkStyle(pathname?.startsWith(link.href) || false)} onClick={() => setMobileMenuOpen(false)}>
            <link.icon size={18} />
            {link.label}
          </Link>
        ))}
      </div>

      <div style={{ padding: '1rem', borderTop: `1px solid ${semantic.border.primary}` }}>
        <button 
          onClick={handleSignOut}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '8px', fontSize: typography.fontSize.sm, color: semantic.text.secondary, background: 'transparent', border: 'none', cursor: 'pointer', transition: transitions.fast, textAlign: 'left' }}
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <style>{`
        .mobile-only { display: none; }
        .mobile-close-btn { display: none; }
        @media (max-width: 1024px) {
          .desktop-sidebar { display: none !important; }
          .desktop-header { display: none !important; }
          .desktop-main { display: none !important; }
          .mobile-only { display: flex !important; }
          .mobile-close-btn { display: block !important; }
        }
      `}</style>

      {/* Desktop Layout */}
      {renderSidebar({ ...sidebarStyle, display: 'flex' })}
      <header style={headerStyle} className="desktop-header">
        <div style={{ display: 'flex', alignItems: 'center', background: semantic.bg.tertiary, borderRadius: '8px', padding: '0.5rem 1rem', width: '300px' }}>
          <Search size={16} color={semantic.text.muted} style={{ marginRight: '0.5rem' }} />
          <input type="text" placeholder="Search transcripts or docs..." style={{ background: 'transparent', border: 'none', color: semantic.text.primary, outline: 'none', width: '100%', fontSize: typography.fontSize.sm }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Badge variant="success" dot>Live Mode Ready</Badge>
          <button style={{ background: 'none', border: 'none', color: semantic.text.secondary, cursor: 'pointer' }}><Bell size={20} /></button>
          <Avatar name={user?.displayName || 'User'} src={user?.photoURL} size={32} />
        </div>
      </header>
      <main style={mainStyle} className="desktop-main">
        {children}
      </main>

      {/* Mobile Layout */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: zIndex.modal - 1 }} onClick={() => setMobileMenuOpen(false)} />
      )}
      {renderSidebar(mobileSidebarStyle)}
      <header style={{ ...mobileHeaderStyle, display: 'none' }} className="mobile-only">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button style={{ background: 'none', border: 'none', color: semantic.text.primary }} onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
          <div style={{ fontWeight: 600 }}>Sunave</div>
        </div>
        <Avatar name={user?.displayName || 'User'} src={user?.photoURL} size={32} />
      </header>
      <main style={{ ...mobileMainStyle, display: 'none' }} className="mobile-only">
        {children}
      </main>
    </>
  );
}
