import type { Metadata } from 'next';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Sunave — AI Meeting Intelligence & Document Generation',
    template: '%s | Sunave',
  },
  description: 'Transcribe meetings live without bots and instantly generate BRDs, MOMs, User Stories, PRDs and more with AI.',
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
