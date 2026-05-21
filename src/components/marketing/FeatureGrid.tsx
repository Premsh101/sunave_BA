'use client';

import React, { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Mic, FileText, Bot, Shield, Layout, Settings } from 'lucide-react';
import Card from '@/components/ui/Card';
import { colors, typography, semantic, gradients, borderRadius } from '@/styles/theme';
import { container, grid } from '@/styles/mixins';

const features = [
  {
    icon: <Mic size={24} />,
    title: 'Bot-Free Transcription',
    description: 'Capture audio directly from the browser without inviting external bots to your secure meetings.',
    color: colors.brand[400],
    gradient: `linear-gradient(135deg, ${colors.brand[500]}20, ${colors.brand[400]}10)`,
  },
  {
    icon: <FileText size={24} />,
    title: 'Dynamic AI Documents',
    description: 'Generate BRDs, FRDs, User Stories, and MOMs with complete control over structure and headers.',
    color: colors.accent[400],
    gradient: `linear-gradient(135deg, ${colors.accent[500]}20, ${colors.accent[400]}10)`,
  },
  {
    icon: <Bot size={24} />,
    title: 'AI Assistant Mode',
    description: 'Optionally invite the Sunave AI Assistant for superior speaker diarization and timeline accuracy.',
    color: colors.brand[400],
    gradient: `linear-gradient(135deg, ${colors.brand[500]}20, ${colors.brand[400]}10)`,
  },
  {
    icon: <Layout size={24} />,
    title: 'Template Studio',
    description: 'Build custom document templates with a drag-and-drop interface and organization-wide sharing.',
    color: colors.accent[400],
    gradient: `linear-gradient(135deg, ${colors.accent[500]}20, ${colors.accent[400]}10)`,
  },
  {
    icon: <Settings size={24} />,
    title: 'Prompt Customization',
    description: 'Fine-tune AI behavior with section-level prompts, domain terminology, and brand voice rules.',
    color: colors.brand[400],
    gradient: `linear-gradient(135deg, ${colors.brand[500]}20, ${colors.brand[400]}10)`,
  },
  {
    icon: <Shield size={24} />,
    title: 'Enterprise Security',
    description: 'Built for compliance with customizable data retention, consent banners, and private workspaces.',
    color: colors.accent[400],
    gradient: `linear-gradient(135deg, ${colors.accent[500]}20, ${colors.accent[400]}10)`,
  },
];

function FeatureCard({ feature, index, active }: { feature: typeof features[number]; index: number; active: boolean }) {
  const style: CSSProperties = {
    opacity: active ? 1 : 0,
    transform: active ? 'none' : 'translateY(30px)',
    transition: `opacity 0.6s cubic-bezier(0.4,0,0.2,1) ${index * 0.1}s, transform 0.6s cubic-bezier(0.4,0,0.2,1) ${index * 0.1}s`,
  };

  return (
    <div style={style}>
      <Card variant="elevated" hoverable>
        <div style={{
          width: 52,
          height: 52,
          borderRadius: borderRadius.lg,
          background: feature.gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          color: feature.color,
          border: `1px solid ${feature.color}30`,
        }}>
          {feature.icon}
        </div>
        <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: 600, marginBottom: '0.625rem', color: semantic.text.primary }}>
          {feature.title}
        </h3>
        <p style={{ color: semantic.text.secondary, lineHeight: 1.65, fontSize: typography.fontSize.sm }}>
          {feature.description}
        </p>
      </Card>
    </div>
  );
}

export default function FeatureGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const sectionStyle: CSSProperties = {
    padding: '7rem 0',
    background: semantic.bg.primary,
  };

  const headerStyle: CSSProperties = {
    textAlign: 'center',
    marginBottom: '4rem',
    opacity: active ? 1 : 0,
    transform: active ? 'none' : 'translateY(20px)',
    transition: 'opacity 0.6s ease, transform 0.6s ease',
  };

  const titleStyle: CSSProperties = {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: semantic.text.primary,
    marginBottom: '1rem',
  };

  const gradientTextStyle: CSSProperties = {
    background: gradients.text,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  return (
    <section style={sectionStyle} id="features" ref={sectionRef}>
      <div style={container}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>
            Enterprise-Grade <span style={gradientTextStyle}>Intelligence</span>
          </h2>
          <p style={{ fontSize: typography.fontSize.lg, color: semantic.text.secondary, maxWidth: '600px', margin: '0 auto' }}>
            A comprehensive suite of tools designed for BAs, PMs, and enterprise teams to automate documentation workflows.
          </p>
        </div>

        <div style={grid(3, '1.5rem')}>
          {features.map((feature, idx) => (
            <FeatureCard key={idx} feature={feature} index={idx} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}
