// src/components/ContactUs.tsx
import React, { useState, useEffect } from 'react';
import { useScale, scaled } from '../hooks/useScale';
import { supabase } from '../lib/supabase';
import { DICT } from '../lib/translations';

export default function ContactUs({ lang, isDark = true }: { lang: 'EN' | 'DE'; isDark?: boolean }) {
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
        background: isDark ? '#0A0A0A' : '#F2F0EB',
        position: 'relative',
        zIndex: 10,
        transition: 'background 0.3s ease, color 0.3s ease',
      }}
    >
      <div style={{ width: '100%' }}>
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <h2 style={{
            fontFamily: "'EB Garamond', serif",
            fontWeight: 700,
            fontSize: 'clamp(32px, 4vw, 48px)',
            color: isDark ? '#fff' : '#0A0A0A',
            marginBottom: 16,
            textTransform: 'none' as const,
            letterSpacing: '-0.02em',
            transition: 'background 0.3s ease, color 0.3s ease',
          }}>
            {t.title}
          </h2>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: '18px',
            color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
            lineHeight: 1.6,
            transition: 'background 0.3s ease, color 0.3s ease',
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
            background: 'rgba(0,204,255,0.05)',
            transition: 'background 0.3s ease, color 0.3s ease',
          }}>
            <h3 style={{ color: '#00ccff', marginBottom: 12, fontFamily: "'Inter', sans-serif", transition: 'background 0.3s ease, color 0.3s ease' }}>{t.successTitle}</h3>
            <p style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)', fontFamily: "'Inter', sans-serif", transition: 'background 0.3s ease, color 0.3s ease' }}>{t.successText}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1fr 1fr', gap: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', fontSize: 13, fontFamily: "'Inter', sans-serif", transition: 'background 0.3s ease, color 0.3s ease' }}>{t.name}</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                    borderRadius: 8,
                    padding: '14px',
                    color: isDark ? '#fff' : '#0A0A0A',
                    fontFamily: "'Inter', sans-serif",
                    outline: 'none',
                    transition: 'background 0.3s ease, color 0.3s ease, border-color 0.3s ease'
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,204,255,0.5)'}
                  onBlur={e => e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', fontSize: 13, fontFamily: "'Inter', sans-serif", transition: 'background 0.3s ease, color 0.3s ease' }}>{t.email}</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                    borderRadius: 8,
                    padding: '14px',
                    color: isDark ? '#fff' : '#0A0A0A',
                    fontFamily: "'Inter', sans-serif",
                    outline: 'none',
                    transition: 'background 0.3s ease, color 0.3s ease, border-color 0.3s ease'
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,204,255,0.5)'}
                  onBlur={e => e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                />
              </div>
            </div>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 8,
              width: '100%',
              margin: '0 auto'
            }}>
              <label style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', fontSize: 13, fontFamily: "'Inter', sans-serif", transition: 'background 0.3s ease, color 0.3s ease' }}>{t.message}</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                rows={5}
                style={{
                  background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                  border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 8,
                  padding: '14px',
                  color: isDark ? '#fff' : '#0A0A0A',
                  fontFamily: "'Inter', sans-serif",
                  outline: 'none',
                  resize: 'none',
                  transition: 'background 0.3s ease, color 0.3s ease, border-color 0.3s ease'
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,204,255,0.5)'}
                onBlur={e => e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
              />
            </div>
            <button
              type="submit"
              style={{
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
                background: isDark ? 'transparent' : 'rgba(235,232,225,0.5)',
                color: isDark ? '#fff' : '#0A0A0A',
                padding: '14px 28px',
                borderRadius: 8,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                fontSize: scaled(14, scale),
                textDecoration: 'none',
                border: isDark ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(0,0,0,0.15)',
                cursor: 'pointer',
                transition: 'all 0.3s ease, background 0.3s ease, color 0.3s ease, border-color 0.3s ease',
                letterSpacing: '0.02em',
                width: '100%',
                marginTop: scaled(12, scale),
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(0,204,255,0.5)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#00ccff';
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.color = isDark ? '#ffffff' : '#0A0A0A';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLButtonElement).style.borderColor = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)';
                (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'transparent' : 'rgba(235,232,225,0.5)';
                (e.currentTarget as HTMLButtonElement).style.color = isDark ? '#fff' : '#0A0A0A';
              }}
              onMouseDown={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#00ccff';
                (e.currentTarget as HTMLButtonElement).style.color = '#ffffff';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(0,204,255,0.6)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.96)';
              }}
              onMouseUp={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              }}
            >
              {t.send}
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
