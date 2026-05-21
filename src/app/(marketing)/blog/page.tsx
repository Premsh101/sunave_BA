import type { Metadata } from 'next';
import React, { type CSSProperties } from 'react';
import { Search, Tag, Clock, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { colors, typography, semantic, borderRadius } from '@/styles/theme';
import { container, grid, gradientText } from '@/styles/mixins';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Product updates, best practices, and insights from the Sunave team on AI meeting intelligence, enterprise documentation, and async collaboration.',
};

const categories = ['All', 'Product', 'AI', 'Best Practices', 'Enterprise', 'Engineering'];

const posts = [
  {
    slug: '#',
    category: 'Product',
    title: 'Introducing Sunave 2.0: The Enterprise AI Meeting OS',
    excerpt: 'We\'re thrilled to announce Sunave 2.0, a complete reimagination of how enterprise teams capture, document, and act on their meetings.',
    author: 'Sunave Team',
    date: 'May 15, 2025',
    readTime: '5 min read',
    featured: true,
    image: null,
  },
  {
    slug: '#',
    category: 'Best Practices',
    title: '10 Ways Business Analysts Are Using AI to Cut Documentation Time by 80%',
    excerpt: 'We interviewed 50 BAs at enterprise companies to understand how they\'ve integrated AI into their meeting-to-document workflow.',
    author: 'Product Team',
    date: 'May 10, 2025',
    readTime: '8 min read',
    featured: false,
    image: null,
  },
  {
    slug: '#',
    category: 'AI',
    title: 'How Sunave\'s Multi-Model AI Pipeline Achieves 97% Transcription Accuracy',
    excerpt: 'A deep dive into the AI architecture behind Sunave\'s transcription engine, including how we handle accents, technical jargon, and cross-talk.',
    author: 'Engineering',
    date: 'May 5, 2025',
    readTime: '12 min read',
    featured: false,
    image: null,
  },
  {
    slug: '#',
    category: 'Enterprise',
    title: 'Why Enterprise Teams Are Switching From Bot-Based to Bot-Free Meeting Recording',
    excerpt: 'Bot fatigue is real. Here\'s why more enterprise security and IT teams are insisting on bot-free recording approaches.',
    author: 'Product Team',
    date: 'April 28, 2025',
    readTime: '6 min read',
    featured: false,
    image: null,
  },
  {
    slug: '#',
    category: 'Engineering',
    title: 'Building Real-Time Transcription in the Browser: Lessons from Sunave\'s Web Audio API Implementation',
    excerpt: 'The technical challenges and solutions behind capturing high-quality audio directly in the browser without native apps.',
    author: 'Engineering',
    date: 'April 20, 2025',
    readTime: '15 min read',
    featured: false,
    image: null,
  },
  {
    slug: '#',
    category: 'Best Practices',
    title: 'The Complete Guide to AI-Generated BRDs: Structure, Prompts, and Review Process',
    excerpt: 'A step-by-step guide to using Sunave to produce Business Requirements Documents that actually satisfy your stakeholders.',
    author: 'Product Team',
    date: 'April 14, 2025',
    readTime: '10 min read',
    featured: false,
    image: null,
  },
];

export default function BlogPage() {
  const heroStyle: CSSProperties = {
    padding: '7rem 0 4rem',
    background: semantic.bg.primary,
    textAlign: 'center',
  };

  const categoryBtnBase: CSSProperties = {
    padding: '0.5rem 1.25rem',
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    border: `1px solid ${semantic.border.subtle}`,
    transition: 'all 0.15s ease',
    textDecoration: 'none',
    display: 'inline-block',
    background: semantic.bg.secondary,
    color: semantic.text.secondary,
  };

  const categoryActivBtn: CSSProperties = {
    ...categoryBtnBase,
    background: `rgba(99,102,241,0.15)`,
    color: colors.brand[400],
    borderColor: 'rgba(99,102,241,0.3)',
  };

  const metaStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontSize: typography.fontSize.xs,
    color: semantic.text.muted,
    marginBottom: '0.75rem',
  };

  return (
    <>
      {/* Hero */}
      <section style={heroStyle}>
        <div style={container}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Badge variant="brand" icon={<BookOpen size={12} />}>
              Sunave Blog
            </Badge>
          </div>
          <h1 style={{
            fontSize: typography.fontSize['5xl'],
            fontWeight: typography.fontWeight.extrabold,
            color: semantic.text.primary,
            marginBottom: '1rem',
            letterSpacing: typography.letterSpacing.tighter,
          }}>
            Ideas, updates &amp;{' '}
            <span style={gradientText()}>insights</span>
          </h1>
          <p style={{ fontSize: typography.fontSize.xl, color: semantic.text.secondary, maxWidth: '580px', margin: '0 auto 2.5rem' }}>
            Product news, best practices, and engineering deep dives from the Sunave team.
          </p>

          {/* Search bar */}
          <div style={{
            maxWidth: '480px',
            margin: '0 auto',
            position: 'relative',
          }}>
            <Search size={18} color={semantic.text.muted} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search articles…"
              readOnly
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 3rem',
                borderRadius: borderRadius.full,
                border: `1px solid ${semantic.border.primary}`,
                background: semantic.bg.secondary,
                color: semantic.text.primary,
                fontSize: typography.fontSize.base,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '1rem 0 3rem', background: semantic.bg.primary }}>
        <div style={container}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {categories.map((cat, i) => (
              <span key={cat} style={i === 0 ? categoryActivBtn : categoryBtnBase}>
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Posts */}
      <section style={{ padding: '2rem 0 6rem', background: semantic.bg.secondary }}>
        <div style={container}>
          {/* Featured Post */}
          {posts.filter((p) => p.featured).map((post) => (
            <Link key={post.title} href={post.slug} style={{ textDecoration: 'none', display: 'block', marginBottom: '2rem' }}>
              <Card variant="elevated" hoverable style={{ padding: '2.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'start' }}>
                  <div>
                    <div style={metaStyle}>
                      <span style={{
                        padding: '2px 10px', borderRadius: borderRadius.full,
                        fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium,
                        background: 'rgba(99,102,241,0.12)', color: colors.brand[400],
                      }}>
                        {post.category}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} /> {post.date}
                      </span>
                      <span>{post.readTime}</span>
                      <span style={{
                        padding: '1px 8px', borderRadius: borderRadius.full,
                        background: 'rgba(34,197,94,0.12)', color: colors.success[400],
                        fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium,
                      }}>
                        Featured
                      </span>
                    </div>
                    <h2 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: semantic.text.primary, marginBottom: '0.75rem', lineHeight: 1.35 }}>
                      {post.title}
                    </h2>
                    <p style={{ color: semantic.text.secondary, lineHeight: 1.65, marginBottom: '1.5rem' }}>
                      {post.excerpt}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: colors.brand[400], fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                      Read more <ArrowRight size={14} />
                    </div>
                  </div>
                  <div style={{ width: 200, height: 140, borderRadius: borderRadius.lg, background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(6,182,212,0.1) 100%)', flexShrink: 0 }} />
                </div>
              </Card>
            </Link>
          ))}

          {/* Post Grid */}
          <div style={grid(3, '1.5rem')}>
            {posts.filter((p) => !p.featured).map((post) => (
              <Link key={post.title} href={post.slug} style={{ textDecoration: 'none' }}>
                <Card variant="elevated" hoverable style={{ height: '100%' }}>
                  <div style={{ height: 140, borderRadius: borderRadius.lg, background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(6,182,212,0.08) 100%)', marginBottom: '1.25rem' }} />
                  <div style={metaStyle}>
                    <span style={{
                      padding: '2px 10px', borderRadius: borderRadius.full,
                      fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium,
                      background: 'rgba(99,102,241,0.12)', color: colors.brand[400],
                    }}>
                      {post.category}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={11} /> {post.date}
                    </span>
                  </div>
                  <h3 style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: semantic.text.primary, marginBottom: '0.625rem', lineHeight: 1.4 }}>
                    {post.title}
                  </h3>
                  <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm, lineHeight: 1.65, marginBottom: '1rem' }}>
                    {post.excerpt}
                  </p>
                  <p style={{ fontSize: typography.fontSize.xs, color: semantic.text.muted }}>
                    {post.readTime} · {post.author}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section style={{ padding: '5rem 0', background: semantic.bg.primary, textAlign: 'center' }}>
        <div style={container}>
          <h2 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: semantic.text.primary, marginBottom: '0.75rem' }}>
            Stay in the loop
          </h2>
          <p style={{ color: semantic.text.secondary, marginBottom: '2rem' }}>
            Get the latest from Sunave delivered to your inbox. No spam, unsubscribe anytime.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', maxWidth: '480px', margin: '0 auto' }}>
            <input
              type="email"
              placeholder="Enter your email"
              readOnly
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: borderRadius.lg,
                border: `1px solid ${semantic.border.primary}`,
                background: semantic.bg.secondary,
                color: semantic.text.primary,
                fontSize: typography.fontSize.base,
                outline: 'none',
              }}
            />
            <Button variant="primary">Subscribe</Button>
          </div>
        </div>
      </section>
    </>
  );
}
