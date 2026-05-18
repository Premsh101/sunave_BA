'use client';

import React, { type CSSProperties } from 'react';
import { Mic, FileText, Bot, Shield, Layout, Settings } from 'lucide-react';
import Card from '@/components/ui/Card';
import { colors, typography, semantic } from '@/styles/theme';
import { container, grid } from '@/styles/mixins';

export default function FeatureGrid() {
  const features = [
    {
      icon: <Mic size={24} color={colors.brand[400]} />,
      title: 'Bot-Free Transcription',
      description: 'Capture audio directly from the browser without inviting external bots to your secure meetings.',
    },
    {
      icon: <FileText size={24} color={colors.accent[400]} />,
      title: 'Dynamic AI Documents',
      description: 'Generate BRDs, FRDs, User Stories, and MOMs with complete control over structure and headers.',
    },
    {
      icon: <Bot size={24} color={colors.brand[400]} />,
      title: 'AI Assistant Mode',
      description: 'Optionally invite the Sunave AI Assistant for superior speaker diarization and timeline accuracy.',
    },
    {
      icon: <Layout size={24} color={colors.accent[400]} />,
      title: 'Template Studio',
      description: 'Build custom document templates with a drag-and-drop interface and organization-wide sharing.',
    },
    {
      icon: <Settings size={24} color={colors.brand[400]} />,
      title: 'Prompt Customization',
      description: 'Fine-tune AI behavior with section-level prompts, domain terminology, and brand voice rules.',
    },
    {
      icon: <Shield size={24} color={colors.accent[400]} />,
      title: 'Enterprise Security',
      description: 'Built for compliance with customizable data retention, consent banners, and private workspaces.',
    },
  ];

  const sectionStyle: CSSProperties = {
    padding: '6rem 0',
    background: semantic.bg.primary,
  };

  const headerStyle: CSSProperties = {
    textAlign: 'center',
    marginBottom: '4rem',
  };

  const titleStyle: CSSProperties = {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: semantic.text.primary,
    marginBottom: '1rem',
  };

  const subtitleStyle: CSSProperties = {
    fontSize: typography.fontSize.lg,
    color: semantic.text.secondary,
    maxWidth: '600px',
    margin: '0 auto',
  };

  const iconWrapperStyle: CSSProperties = {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: semantic.bg.brandSubtle,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  };

  return (
    <section style={sectionStyle} id="features">
      <div style={container}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Enterprise-Grade Intelligence</h2>
          <p style={subtitleStyle}>
            A comprehensive suite of tools designed for BAs, PMs, and enterprise teams to automate documentation workflows.
          </p>
        </div>

        <div style={grid(3, '2rem')}>
          {features.map((feature, idx) => (
            <Card key={idx} variant="elevated" hoverable>
              <div style={iconWrapperStyle}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: 600, marginBottom: '0.5rem', color: semantic.text.primary }}>
                {feature.title}
              </h3>
              <p style={{ color: semantic.text.secondary, lineHeight: 1.6 }}>
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
