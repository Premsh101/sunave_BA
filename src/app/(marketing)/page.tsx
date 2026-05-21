import React from 'react';
import Hero from '@/components/marketing/Hero';
import StatsSection from '@/components/marketing/StatsSection';
import FeatureGrid from '@/components/marketing/FeatureGrid';
import SecurityBadges from '@/components/marketing/SecurityBadges';
import CTASection from '@/components/marketing/CTASection';

export default function MarketingHome() {
  return (
    <>
      <Hero />
      <StatsSection />
      <FeatureGrid />
      <SecurityBadges />
      <CTASection />
    </>
  );
}
