'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth/AuthContext';
import { Video, FileText, Settings, Clock, LayoutTemplate } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { typography, semantic, gradients } from '@/styles/theme';
import { grid } from '@/styles/mixins';

export default function DashboardHome() {
  const { user } = useAuth();

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Welcome Section */}
      <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: typography.fontSize['3xl'], fontWeight: 700, color: semantic.text.primary, marginBottom: '0.5rem' }}>
            Welcome back, {user?.displayName?.split(' ')[0] || 'User'} 👋
          </h1>
          <p style={{ color: semantic.text.secondary }}>
            You have <span style={{ color: semantic.text.primary, fontWeight: 500 }}>3</span> recent transcripts waiting for document generation.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/template-studio">
            <Button variant="secondary" icon={<LayoutTemplate size={16} />}>
              New Template
            </Button>
          </Link>
          <Link href="/meetings/live">
            <Button variant="primary" icon={<Video size={16} />}>
              Start Meeting
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={grid(4, '1.5rem')}>
        <Card variant="gradient" hoverable style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Video size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#fff' }}>New Live Meeting</div>
            <div style={{ fontSize: typography.fontSize.sm, color: 'rgba(255,255,255,0.7)' }}>Start bot-free transcription</div>
          </div>
        </Card>

        <Card hoverable style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: semantic.bg.tertiary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: semantic.text.primary }}>
            <FileText size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: semantic.text.primary }}>Generate BRD</div>
            <div style={{ fontSize: typography.fontSize.sm, color: semantic.text.secondary }}>From existing transcript</div>
          </div>
        </Card>

        <Card hoverable style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: semantic.bg.tertiary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: semantic.text.primary }}>
            <Settings size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: semantic.text.primary }}>Prompt Studio</div>
            <div style={{ fontSize: typography.fontSize.sm, color: semantic.text.secondary }}>Fine-tune AI behavior</div>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Recent Activity */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: typography.fontSize.lg, fontWeight: 600, color: semantic.text.primary }}>Recent Meetings</h2>
            <Link href="/meetings" style={{ fontSize: typography.fontSize.sm, color: semantic.text.brand, textDecoration: 'none' }}>View all</Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2, 3].map((i) => (
              <Card key={i} hoverable style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: semantic.bg.tertiary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Video size={18} color={semantic.text.secondary} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, color: semantic.text.primary }}>Q2 Sprint Planning & Grooming</div>
                    <div style={{ fontSize: typography.fontSize.xs, color: semantic.text.muted, display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <Clock size={12} /> Today, 10:00 AM • 45m • Bot-Free
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Badge variant="success">Completed</Badge>
                  <Button variant="secondary" size="sm">Review</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Usage Widget */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: typography.fontSize.lg, fontWeight: 600, color: semantic.text.primary }}>Usage</h2>
          </div>
          
          <Card style={{ background: semantic.bg.secondary }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ fontSize: typography.fontSize.sm, color: semantic.text.secondary }}>Plan</div>
              <Badge variant="brand">Pro Plan</Badge>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: typography.fontSize.sm, marginBottom: '0.5rem' }}>
                <span style={{ color: semantic.text.primary }}>AI Documents</span>
                <span style={{ color: semantic.text.muted }}>12 / Unlimited</span>
              </div>
              <div style={{ width: '100%', height: 6, background: semantic.bg.tertiary, borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: '25%', height: '100%', background: gradients.brand }} />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: typography.fontSize.sm, marginBottom: '0.5rem' }}>
                <span style={{ color: semantic.text.primary }}>Transcription Hours</span>
                <span style={{ color: semantic.text.muted }}>14h / Unlimited</span>
              </div>
              <div style={{ width: '100%', height: 6, background: semantic.bg.tertiary, borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: '40%', height: '100%', background: gradients.brand }} />
              </div>
            </div>

            <Button variant="secondary" fullWidth style={{ fontSize: typography.fontSize.xs }}>
              View full usage details
            </Button>
          </Card>
        </div>

      </div>
    </div>
  );
}
