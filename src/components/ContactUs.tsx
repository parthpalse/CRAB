import React, { useState, useEffect } from 'react';
import { useScale, scaled } from '../hooks/useScale';
import { supabase } from '../lib/supabase';
import { DICT } from '../lib/translations';

export default function ContactUs({ lang }: { lang: 'EN' | 'DE' }) {
  const t = DICT[lang].contact;
  const scale = useScale();
  const [submitted, setSubmitted] = React.useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('form').insert([{ name, email, message }]);
    if (error) {
      console.error('Supabase Error:', error);
      alert('Failed to send message: ' + error.message);
    } else {
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <section id="contact" style={{ position: 'relative', width: '100%', paddingTop: '120px', paddingBottom: '120px', paddingLeft: scaled(109, scale), paddingRight: scaled(109, scale), boxSizing: 'border-box' as const, background: '#0A0A0A', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <div style={{ width: '100%', position: 'relative', zIndex: 2 }}>
        <h2 style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 550, fontSize: 'clamp(32px, 4.5vw, 60px)', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.05, textTransform: 'uppercase', marginBottom: 16, textAlign: 'left' }}>{t.title}</h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: 'clamp(15px, 1.2vw, 18px)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, textAlign: 'left', marginBottom: 48 }}>{t.subtitle}</p>
        
        {submitted ? (
          <div style={{ padding: '40px', border: '1px solid #00ccff', borderRadius: 8, background: 'rgba(0,204,255,0.05)', color: '#fff', fontFamily: "'Inter', sans-serif", textAlign: 'center', width: '100%' }}>
            <h3 style={{ fontSize: '24px', marginBottom: 12 }}>{t.successTitle}</h3>
            <p style={{ opacity: 0.7 }}>{t.successText}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
            <label style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 400, fontSize: '11px', color: 'rgba(0,204,255,0.6)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>{t.name}</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.12)', padding: '20px', color: '#fff', borderRadius: 8, outline: 'none', fontFamily: "'Inter', sans-serif", fontWeight: 300 }} placeholder="John Doe" />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
            <label style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 400, fontSize: '11px', color: 'rgba(0,204,255,0.6)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>{t.email}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.12)', padding: '20px', color: '#fff', borderRadius: 8, outline: 'none', fontFamily: "'Inter', sans-serif", fontWeight: 300 }} placeholder="john@company.com" />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
            <label style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 400, fontSize: '11px', color: 'rgba(0,204,255,0.6)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>{t.message}</label>
            <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required style={{ width: '100%', background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.12)', padding: '20px', color: '#fff', borderRadius: 8, outline: 'none', fontFamily: "'Inter', sans-serif", fontWeight: 300, resize: 'vertical' }} placeholder="How can we help you?" />
          </div>
          
          <button 
            type="submit" 
            style={{ 
              width: '100%',
              background: 'transparent', 
              border: '1px solid rgba(0,204,255,0.3)', 
              color: '#fff', 
              padding: '20px', 
              borderRadius: 8, 
              fontFamily: "'Inter', sans-serif", 
              fontWeight: 300, 
              fontSize: '16px', 
              letterSpacing: '0.02em',
              cursor: 'pointer', 
              marginTop: 10, 
              transition: 'all 0.3s ease' 
            }} 
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0,204,255,0.4)';
              e.currentTarget.style.borderColor = '#00ccff';
            }} 
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(0,204,255,0.3)';
              e.currentTarget.style.background = 'transparent';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.background = '#00ccff';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0,204,255,0.6)';
              e.currentTarget.style.transform = 'scale(0.96)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'scale(1)';
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
