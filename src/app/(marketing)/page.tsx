import React from 'react';
import Hero from '@/components/marketing/Hero';
import StatsSection from '@/components/marketing/StatsSection';
import FeatureGrid from '@/components/marketing/FeatureGrid';
import PricingPreview from '@/components/marketing/PricingPreview';
import CTASection from '@/components/marketing/CTASection';

export default function MarketingHome() {
  return (
    <>
      <Hero />
      <StatsSection />
      <FeatureGrid />
      <PricingPreview />
      <CTASection />
    </>
  );
}
