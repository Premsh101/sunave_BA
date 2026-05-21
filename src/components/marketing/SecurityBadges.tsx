'use client';

import React, { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ShieldCheck, Lock, Server, FileText } from 'lucide-react';
import { colors, typography, semantic, borderRadius } from '@/styles/theme';
import { container } from '@/styles/mixins';
import animations from '@/styles/animations';

const BASE_BADGES = [
  { icon: <ShieldCheck size={18} />, label: 'GDPR Compliant Architecture', color: colors.success[400] },
  { icon: <Lock size={18} />, label: 'End-to-End Encryption', color: colors.accent[400] },
  { icon: <Server size={18} />, label: 'Isolated Tenant Hosting', color: colors.brand[400] },
  { icon: <FileText size={18} />, label: 'ISO-Ready Security Protocols', color: colors.warning[400] },
];

// Duplicate for seamless marquee loop
const BADGES = [...BASE_BADGES, ...BASE_BADGES];

function BadgeItem({ badge }: { badge: typeof BADGES[number] }) {
  const [hovered, setHovered] = useState(false);
  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.625rem',
    padding: '0.625rem 1.25rem',
    borderRadius: borderRadius.full,
    border: `1px solid ${hovered ? `${badge.color}50` : 'rgba(255,255,255,0.08)'}`,
    background: hovered ? `${badge.color}0D` : 'rgba(255,255,255,0.03)',
    transition: 'all 0.25s ease',
    flexShrink: 0,
    cursor: 'default',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    boxShadow: hovered ? `0 0 18px ${badge.color}22` : 'none',
    whiteSpace: 'nowrap',
  };
  return (
    <div
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ color: badge.color, display: 'flex', alignItems: 'center' }}>{badge.icon}</span>
      <span style={{ fontSize: typography.fontSize.sm, color: semantic.text.secondary, fontWeight: typography.fontWeight.medium }}>
        {badge.label}
      </span>
    </div>
  );
}

export default function SecurityBadges() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const sectionStyle: CSSProperties = {
    padding: '5rem 0',
    background: semantic.bg.secondary,
    borderTop: '1px solid rgba(255,255,255,0.05)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    overflow: 'hidden',
    position: 'relative',
  };

  return (
    <section style={sectionStyle} ref={sectionRef} id="security">
      <div style={container}>
        <div style={{
          textAlign: 'center',
          marginBottom: '2.5rem',
          opacity: active ? 1 : 0,
          transform: active ? 'none' : 'translateY(16px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          <div style={{ fontSize: typography.fontSize.xs, color: colors.accent[400], fontWeight: typography.fontWeight.semibold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            TRUST & COMPLIANCE
          </div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: typography.fontWeight.bold, color: semantic.text.primary }}>
            Enterprise-grade security, by design
          </h2>
        </div>
      </div>

      {/* Marquee track */}
      <div style={{
        opacity: active ? 1 : 0,
        transition: 'opacity 0.8s ease 0.2s',
        position: 'relative',
      }}>
        {/* Fade edges */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '10%', background: `linear-gradient(to right, ${semantic.bg.secondary}, transparent)`, zIndex: 1, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '10%', background: `linear-gradient(to left, ${semantic.bg.secondary}, transparent)`, zIndex: 1, pointerEvents: 'none' }} />

        <div style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: '1rem', animation: animations.marquee(30), width: 'max-content', padding: '0.25rem 0' }}>
            {BADGES.map((badge, i) => (
              <BadgeItem key={i} badge={badge} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
