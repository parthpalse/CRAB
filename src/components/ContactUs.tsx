import React from 'react';

export default function ContactUs() {
  return (
    <section id="contact" style={{ position: 'relative', width: '100%', padding: '120px 8vw', background: '#0A0A0A', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <div style={{ width: '100%', position: 'relative', zIndex: 2 }}>
        <h2 style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 550, fontSize: 'clamp(32px, 4.5vw, 60px)', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.05, textTransform: 'uppercase', marginBottom: 16, textAlign: 'left' }}>Contact Us</h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: 'clamp(15px, 1.2vw, 18px)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, textAlign: 'left', marginBottom: 48 }}>Ready to unlock your business potential? Get in touch.</p>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
            <label style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 400, fontSize: '11px', color: 'rgba(0,204,255,0.6)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Name</label>
            <input type="text" style={{ width: '100%', background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.12)', padding: '20px', color: '#fff', borderRadius: 8, outline: 'none', fontFamily: "'Inter', sans-serif", fontWeight: 300 }} placeholder="John Doe" />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
            <label style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 400, fontSize: '11px', color: 'rgba(0,204,255,0.6)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Email</label>
            <input type="email" style={{ width: '100%', background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.12)', padding: '20px', color: '#fff', borderRadius: 8, outline: 'none', fontFamily: "'Inter', sans-serif", fontWeight: 300 }} placeholder="john@company.com" />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
            <label style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 400, fontSize: '11px', color: 'rgba(0,204,255,0.6)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Message</label>
            <textarea rows={5} style={{ width: '100%', background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.12)', padding: '20px', color: '#fff', borderRadius: 8, outline: 'none', fontFamily: "'Inter', sans-serif", fontWeight: 300, resize: 'vertical' }} placeholder="How can we help you?" />
          </div>
          
          <button 
            type="button" 
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
            }}
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
