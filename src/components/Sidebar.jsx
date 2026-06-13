import React from 'react';

const navItems = [
  { id: 'dashboard', icon: '🏠', label: 'Dashboard',       section: 'MAIN' },
  { id: 'cattle',    icon: '🐄', label: 'All Cattle',      section: 'CATTLE' },
  { id: 'cows',      icon: '🥛', label: 'Cows & Milk',     section: 'CATTLE' },
  { id: 'bulls',     icon: '🐂', label: 'Bulls',           section: 'CATTLE' },
  { id: 'breeding',  icon: '💑', label: 'Breeding',        section: 'HEALTH' },
  { id: 'births',    icon: '🐣', label: 'Births',          section: 'HEALTH' },
  { id: 'deaths',    icon: '⚰️', label: 'Deaths',          section: 'HEALTH' },
  { id: 'weight',    icon: '⚖️', label: 'Weight Records', section: 'HEALTH' },
  { id: 'purchases', icon: '🛒', label: 'Purchases',       section: 'FINANCE' },
  { id: 'sales',     icon: '💰', label: 'Sales',           section: 'FINANCE' },
  { id: 'profit',    icon: '📊', label: 'Profit & Loss',   section: 'FINANCE' },
];

export default function Sidebar({ active, onNav }) {
  const sections = [...new Set(navItems.map(n => n.section))];

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="brand">
          <span className="brand-icon">🐄</span>
          <div>
            <div>CattleCare</div>
            <div className="brand-sub">Pro Farm Manager</div>
          </div>
        </div>
      </div>

      {/* Farm Badge */}
      <div className="sidebar-farm-badge">
        <div className="farm-icon">🌾</div>
        <div>
          <div className="farm-name">Green Valley Farm</div>
          <div className="farm-loc">📍 Mianwali, Punjab</div>
        </div>
      </div>

      {/* Nav */}
      {sections.map(sec => (
        <div key={sec}>
          <div className="nav-section-label">{sec}</div>
          {navItems.filter(n => n.section === sec).map(item => (
            <div
              key={item.id}
              className={`nav-item ${active === item.id ? 'active' : ''}`}
              onClick={() => onNav(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      ))}

      {/* Bottom */}
      <div style={{ marginTop: 'auto', padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>
          CSC-271 Database Systems<br />
          Namal University, Mianwali
        </div>
      </div>
    </div>
  );
}