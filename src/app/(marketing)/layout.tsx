import type { Metadata } from 'next';
import StitchNav from '@/components/marketing/StitchNav';
import StitchFooter from '@/components/marketing/StitchFooter';

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
    <div className="bg-mk-bg text-mk-fg font-inter min-h-screen">
      <StitchNav />
      <main className="min-h-screen">{children}</main>
      <StitchFooter />
    </div>
  );
}
