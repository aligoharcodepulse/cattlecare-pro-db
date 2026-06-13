import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { ToastContainer } from './components/UI';

// Pages
import Dashboard from './pages/Dashboard';
import CattlePage from './pages/CattlePage';
import CowsPage from './pages/CowsPage';
import { BullsPage, BreedingPage, BirthsPage, DeathsPage } from './pages/HealthPages';
import { WeightPage, PurchasesPage, SalesPage, ProfitLossPage } from './pages/FinancePages';

const PAGE_TITLES = {
  dashboard: { title: 'Dashboard',        icon: '🏠' },
  cattle:    { title: 'All Cattle',        icon: '🐄' },
  cows:      { title: 'Cows & Milk',       icon: '🥛' },
  bulls:     { title: 'Bulls',             icon: '🐂' },
  breeding:  { title: 'Breeding Records',  icon: '💑' },
  births:    { title: 'Birth Records',     icon: '🐣' },
  deaths:    { title: 'Death Records',     icon: '🪦' },
  weight:    { title: 'Weight Records',    icon: '⚖️' },
  purchases: { title: 'Purchase Records',  icon: '🛒' },
  sales:     { title: 'Sale Records',      icon: '💰' },
  profit:    { title: 'Profit & Loss',     icon: '📊' },
};

function PageContent({ page }) {
  switch (page) {
    case 'dashboard': return <Dashboard />;
    case 'cattle':    return <CattlePage />;
    case 'cows':      return <CowsPage />;
    case 'bulls':     return <BullsPage />;
    case 'breeding':  return <BreedingPage />;
    case 'births':    return <BirthsPage />;
    case 'deaths':    return <DeathsPage />;
    case 'weight':    return <WeightPage />;
    case 'purchases': return <PurchasesPage />;
    case 'sales':     return <SalesPage />;
    case 'profit':    return <ProfitLossPage />;
    default:          return <Dashboard />;
  }
}

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const current = PAGE_TITLES[activePage] || PAGE_TITLES['dashboard'];
  const today = new Date().toLocaleDateString('en-PK', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  });

  function handleNav(page) {
    setActivePage(page);
    setSidebarOpen(false); // close on mobile
  }

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar active={activePage} onNav={handleNav} />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            zIndex: 99, display: 'none'
          }}
        />
      )}

      {/* Main */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="topbar">
          {/* Hamburger for mobile */}
          <button
            onClick={() => setSidebarOpen(o => !o)}
            style={{
              display: 'none', background: 'none', border: 'none',
              fontSize: 24, cursor: 'pointer', marginRight: 12
            }}
            className="hamburger-btn"
          >
            ☰
          </button>

          <div className="topbar-title">
            <span>{current.icon}</span> {current.title}
          </div>

          <div className="topbar-right">
            <div className="topbar-date">📅 {today}</div>
            <div style={{
              width: 38, height: 38, background: 'var(--green-pale)',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 20, cursor: 'pointer',
              border: '2px solid var(--green-light)'
            }}>
              👨‍🌾
            </div>
          </div>
        </div>

        {/* Page Body */}
        <div className="page-body">
          <PageContent page={activePage} />
        </div>
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
}