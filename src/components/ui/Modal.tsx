'use client';

import React, { useState, useEffect, type CSSProperties, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { colors, borderRadius, transitions, shadows, semantic, zIndex } from '@/styles/theme';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showClose?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
}: ModalProps) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      requestAnimationFrame(() => setAnimating(true));
    } else {
      setAnimating(false);
      const timer = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!visible) return null;

  const sizeMap: Record<string, string> = {
    sm: '400px',
    md: '560px',
    lg: '720px',
    xl: '960px',
    full: '95vw',
  };

  const overlayStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: zIndex.modal,
    opacity: animating ? 1 : 0,
    transition: 'opacity 0.2s ease',
    padding: '1rem',
  };

  const contentStyle: CSSProperties = {
    background: semantic.bg.secondary,
    borderRadius: borderRadius['2xl'],
    border: `1px solid ${semantic.border.primary}`,
    boxShadow: shadows['2xl'],
    maxWidth: sizeMap[size],
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    transform: animating ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
    opacity: animating ? 1 : 0,
    transition: 'transform 0.2s ease, opacity 0.2s ease',
  };

  const headerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 1.5rem',
    borderBottom: `1px solid ${semantic.border.primary}`,
  };

  const titleStyle: CSSProperties = {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: semantic.text.primary,
  };

  const closeStyle: CSSProperties = {
    background: 'none',
    border: 'none',
    color: semantic.text.muted,
    cursor: 'pointer',
    padding: '0.25rem',
    borderRadius: borderRadius.base,
    display: 'flex',
    alignItems: 'center',
    transition: transitions.fast,
  };

  const bodyStyle: CSSProperties = {
    padding: '1.5rem',
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        {(title || showClose) && (
          <div style={headerStyle}>
            {title && <h2 style={titleStyle}>{title}</h2>}
            {showClose && (
              <button style={closeStyle} onClick={onClose} aria-label="Close modal">
                <X size={20} />
              </button>
            )}
          </div>
        )}
        <div style={bodyStyle}>{children}</div>
      </div>
    </div>
  );
}
