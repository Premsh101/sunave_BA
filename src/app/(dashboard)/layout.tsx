'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarClock,
  Mic,
  FileText,
  Terminal,
  Layers,
  Settings,
  CreditCard,
  LogOut,
  AudioLines,
  Search,
  Bell,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import Avatar from '@/components/ui/Avatar';
import { PageLoader } from '@/components/ui/Spinner';

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/meetings', label: 'Meetings', icon: CalendarClock, exact: true },
  { href: '/meetings/live', label: 'Live Meeting', icon: Mic },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/prompt-studio', label: 'Prompt Studio', icon: Terminal },
  { href: '/template-studio', label: 'Template Studio', icon: Layers },
];

const BOTTOM_LINKS = [
  { href: '/billing', label: 'Billing', icon: CreditCard },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  // Client-side auth guard: redirect to /login only after Firebase has
  // finished initialising (loading=false). Prevents redirect loops caused
  // by checking auth before onAuthStateChanged resolves.
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <PageLoader />;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const isActive = (link: { href: string; exact?: boolean }) =>
    link.exact ? pathname === link.href : pathname?.startsWith(link.href) || false;

  const navItem = (link: (typeof NAV_LINKS)[number] & { exact?: boolean }) => {
    const active = isActive(link);
    return (
      <Link
        key={link.href}
        href={link.href}
        onClick={() => setMobileMenuOpen(false)}
        className={`flex items-center gap-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
          active
            ? 'bg-app-primary-container text-app-on-primary-container border-l-4 border-app-inverse-primary font-semibold'
            : 'text-app-fg-variant hover:bg-app-surface-high hover:text-app-fg'
        }`}
      >
        <link.icon size={18} />
        {link.label}
      </Link>
    );
  };

  const sidebar = (
    <div className="h-full flex flex-col py-8 px-4">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-lg bg-app-primary-container flex items-center justify-center">
          <AudioLines size={20} className="text-app-on-primary-container" />
        </div>
        <div>
          <h1 className="font-jakarta text-xl font-bold text-app-primary tracking-tight leading-none">
            Sunave
          </h1>
          <p className="text-[11px] font-semibold text-app-fg-variant uppercase tracking-widest mt-1">
            AI Assistant
          </p>
        </div>
        <button
          className="lg:hidden ml-auto text-app-fg-variant"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Links */}
      <div className="flex flex-col gap-1 flex-1 overflow-y-auto">{NAV_LINKS.map(navItem)}</div>

      {/* Bottom */}
      <div className="mt-auto pt-4 border-t border-app-outline/30 flex flex-col gap-1">
        {BOTTOM_LINKS.map(navItem)}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-4 px-4 py-2 rounded-lg text-sm font-medium text-app-fg-variant hover:bg-app-surface-high hover:text-app-error transition-colors duration-200 text-left"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-app-bg text-app-fg font-jakarta">
      {/* Desktop sidebar */}
      <nav className="hidden lg:flex flex-col h-screen w-[280px] fixed left-0 top-0 border-r border-app-outline bg-app-bg/80 backdrop-blur-md z-40">
        {sidebar}
      </nav>

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <nav className="fixed left-0 top-0 h-screen w-[280px] border-r border-app-outline bg-app-bg z-50 lg:hidden">
            {sidebar}
          </nav>
        </>
      )}

      {/* Top bar */}
      <header className="fixed top-0 right-0 h-16 w-full lg:w-[calc(100%-280px)] bg-app-bg/50 backdrop-blur-md flex justify-between items-center px-4 md:px-8 z-30">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            className="lg:hidden text-app-fg"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="relative w-full group hidden sm:block">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-app-outline-strong group-focus-within:text-app-primary transition-colors"
            />
            <input
              type="text"
              placeholder="Search transcripts, docs..."
              className="w-full bg-app-surface-low border border-app-outline rounded-full py-2 pl-10 pr-4 text-sm text-app-fg placeholder:text-app-outline-strong focus:outline-none focus:border-app-primary focus:ring-1 focus:ring-app-primary/20 transition-all"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center text-app-fg-variant hover:bg-app-surface-high hover:text-app-primary transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-app-error rounded-full ring-2 ring-app-bg" />
          </button>
          <div className="rounded-full border border-app-outline overflow-hidden">
            <Avatar name={user?.displayName || 'User'} src={user?.photoURL} size={32} />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="pt-16 lg:ml-[280px] min-h-screen">{children}</main>
    </div>
  );
}
