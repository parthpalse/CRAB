// src/components/ContactUs.tsx
import React, { useState, useEffect } from 'react';
import { useScale, scaled } from '../hooks/useScale';
import { supabase } from '../lib/supabase';
import { DICT } from '../lib/translations';

export default function ContactUs({ lang }: { lang: 'EN' | 'DE' }) {
  const t = DICT[lang].contact;
  const scale = useScale();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setIsTablet(w >= 768 && w < 1024);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('form')
        .insert([{ name, email, message }]);
      
      if (error) throw error;
      
      await fetch('https://formsubmit.co/ajax/Crab.ai2026@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  return (
    <section
      id="contact"
      style={{
        padding: isMobile ? '80px 24px' : isTablet ? '100px 48px' : `120px ${scaled(109, scale)}`,
        background: '#0A0A0A',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <h2 style={{
            fontFamily: "'Satoshi', sans-serif",
            fontWeight: 550,
            fontSize: 'clamp(32px, 4vw, 48px)',
            color: '#fff',
            marginBottom: 16,
            textTransform: 'uppercase' as const,
            letterSpacing: '-0.02em'
          }}>
            {t.title}
          </h2>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: '18px',
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.6
          }}>
            {t.subtitle}
          </p>
        </div>

        {submitted ? (
          <div style={{
            padding: '40px',
            border: '1px solid rgba(0,204,255,0.3)',
            borderRadius: 12,
            textAlign: 'center',
            background: 'rgba(0,204,255,0.05)'
          }}>
            <h3 style={{ color: '#00ccff', marginBottom: 12, fontFamily: "'Satoshi', sans-serif" }}>{t.successTitle}</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'Inter', sans-serif" }}>{t.successText}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1fr 1fr', gap: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>{t.name}</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    padding: '14px',
                    color: '#fff',
                    fontFamily: "'Inter', sans-serif",
                    outline: 'none',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,204,255,0.5)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>{t.email}</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    padding: '14px',
                    color: '#fff',
                    fontFamily: "'Inter', sans-serif",
                    outline: 'none',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,204,255,0.5)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>{t.message}</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                rows={5}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  padding: '14px',
                  color: '#fff',
                  fontFamily: "'Inter', sans-serif",
                  outline: 'none',
                  resize: 'none',
                  transition: 'border-color 0.3s'
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,204,255,0.5)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
            <button
              type="submit"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'transparent',
                border: '1px solid rgba(0,204,255,0.4)',
                borderRadius: 8,
                padding: '16px',
                color: '#fff',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                fontSize: '16px',
                letterSpacing: '0.02em',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '100%',
                maxWidth: isMobile ? 'none' : '400px',
                alignSelf: isMobile ? 'stretch' : 'center',
                boxSizing: 'border-box' as const,
                marginTop: 12
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(0,204,255,0.1)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0,204,255,0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {t.send}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
