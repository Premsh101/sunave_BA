import type { Metadata } from 'next';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Sunave — Enterprise Voice Automation Platform',
    template: '%s | Sunave',
  },
  description: 'Deploy production-ready enterprise voicebots at sub-500ms latency for recruitment screening and merchant verification.',
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh' }}>{children}</main>
      <Footer />
    </>
  );
}
