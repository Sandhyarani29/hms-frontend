import React from 'react';

function Navbar() {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '60px',
      backgroundColor: '#1a73e8',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '8px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', fontWeight: '700', color: '#fff',
        }}>H</div>
        <div>
          <div style={{ color: '#fff', fontWeight: '700', fontSize: '16px', lineHeight: 1 }}>
            Hospital Management
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>
            Admin Dashboard
          </div>
        </div>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '34px', height: '34px', borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
        }}>A</div>
      </div>
    </nav>
  );
}

export default Navbar;