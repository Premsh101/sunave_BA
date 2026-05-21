'use client';

import React, { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Users, FileText, Clock, TrendingUp } from 'lucide-react';
import { typography, semantic, colors, borderRadius } from '@/styles/theme';
import { container } from '@/styles/mixins';

const STATS = [
  { icon: <Users size={24} />, value: 12000, suffix: '+', label: 'Enterprise Users', color: colors.brand[400] },
  { icon: <FileText size={24} />, value: 2.4, suffix: 'M+', label: 'Docs Generated', color: colors.accent[400] },
  { icon: <Clock size={24} />, value: 85, suffix: '%', label: 'Time Saved on Docs', color: colors.success[400] },
  { icon: <TrendingUp size={24} />, value: 98, suffix: '%', label: 'Customer Satisfaction', color: colors.warning[400] },
];

function useCountUp(target: number, decimals = 0, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 1600;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(parseFloat(start.toFixed(decimals)));
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, decimals]);
  return count;
}

function StatCard({ stat, active }: { stat: typeof STATS[number]; active: boolean }) {
  const isDecimal = stat.value % 1 !== 0;
  const count = useCountUp(stat.value, isDecimal ? 1 : 0, active);
  const [hovered, setHovered] = useState(false);

  const cardStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '2rem 1.5rem',
    borderRadius: borderRadius.xl,
    background: semantic.bg.elevated,
    border: `1px solid ${hovered ? semantic.border.brandSubtle : semantic.border.primary}`,
    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
    transform: hovered ? 'translateY(-6px)' : 'none',
    boxShadow: hovered ? '0 20px 40px -12px rgba(0,0,0,0.3), 0 0 0 1px rgba(99,102,241,0.15)' : '0 1px 3px rgba(0,0,0,0.1)',
    cursor: 'default',
  };

  const iconWrapStyle: CSSProperties = {
    width: 52,
    height: 52,
    borderRadius: borderRadius.lg,
    background: `${stat.color}18`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.25rem',
    color: stat.color,
    transition: 'transform 0.3s ease',
    transform: hovered ? 'scale(1.1) rotate(-5deg)' : 'none',
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={iconWrapStyle}>{stat.icon}</div>
      <div style={{
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontWeight: typography.fontWeight.extrabold,
        color: stat.color,
        lineHeight: 1,
        marginBottom: '0.5rem',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {count}{stat.suffix}
      </div>
      <div style={{ fontSize: typography.fontSize.sm, color: semantic.text.secondary, fontWeight: typography.fontWeight.medium }}>
        {stat.label}
      </div>
    </div>
  );
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const sectionStyle: CSSProperties = {
    padding: '5rem 0',
    background: semantic.bg.secondary,
    borderTop: `1px solid ${semantic.border.subtle}`,
    borderBottom: `1px solid ${semantic.border.subtle}`,
  };

  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
  };

  return (
    <section style={sectionStyle} ref={sectionRef}>
      <div style={container}>
        <div style={gridStyle}>
          {STATS.map((stat, i) => (
            <StatCard key={i} stat={stat} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}
