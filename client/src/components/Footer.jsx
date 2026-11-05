import React from 'react';

const Footer = () => {
  return (
    <footer className="footer-container" style={{
      backgroundColor: '#064e3b',
      color: '#d1fae5',
      padding: '16px 24px',
      marginTop: 'auto',
      textAlign: 'center',
      fontSize: '0.9rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} 🌱 GreenCart. All rights reserved.</p>
        <p style={{ margin: 0, fontWeight: '500', color: '#a7f3d0' }}>
          Developed and designed by <strong>Liji T.S</strong>
        </p>
      </div>
    </footer>
  );
};

export default Footer;