import React from 'react';

export default function ContactUs() {
  return (
    <section style={{ position: 'relative', width: '100%', padding: '120px 2vw', background: '#0A0A0A', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: 600, width: '100%', position: 'relative', zIndex: 2 }}>
        <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 36, color: '#fff', fontWeight: 700, marginBottom: 12, textAlign: 'center' }}>Contact Us</h2>
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 16, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 40 }}>Ready to unlock your business potential? Get in touch.</p>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: 'rgba(0,204,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Name</label>
            <input type="text" style={{ background: '#111', border: '1px solid rgba(0,204,255,0.2)', padding: '16px', color: '#fff', borderRadius: 8, outline: 'none', fontFamily: 'Inter,sans-serif' }} placeholder="John Doe" />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: 'rgba(0,204,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Email</label>
            <input type="email" style={{ background: '#111', border: '1px solid rgba(0,204,255,0.2)', padding: '16px', color: '#fff', borderRadius: 8, outline: 'none', fontFamily: 'Inter,sans-serif' }} placeholder="john@company.com" />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: 'rgba(0,204,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Message</label>
            <textarea rows={5} style={{ background: '#111', border: '1px solid rgba(0,204,255,0.2)', padding: '16px', color: '#fff', borderRadius: 8, outline: 'none', fontFamily: 'Inter,sans-serif', resize: 'vertical' }} placeholder="How can we help you?" />
          </div>
          
          <button type="button" style={{ background: 'rgba(0,204,255,0.1)', border: '1px solid rgba(0,204,255,0.4)', color: '#00ccff', padding: '16px', borderRadius: 8, fontFamily: "'Orbitron',sans-serif", fontSize: 16, fontWeight: 600, cursor: 'pointer', marginTop: 10, transition: 'all 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,204,255,0.2)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,204,255,0.1)'}>
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
