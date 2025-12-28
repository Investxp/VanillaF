import React from 'react';

export default function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 64 }}>
      <img src="/logo192.png" alt="Logo" style={{ height: 40, width: 40, marginRight: 8 }} />
      <span style={{ fontWeight: 700, fontSize: 20, color: '#1976d2', letterSpacing: 1 }}>DerivSites</span>
    </div>
  );
}
