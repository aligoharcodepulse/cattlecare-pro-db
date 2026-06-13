import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../api';
import { Loading } from '../components/UI';

// Mock stats when backend not connected
const MOCK = {
  totalCattle: 30, activeCattle: 24, soldCattle: 4, deadCattle: 2,
  totalCows: 17, lactatingCows: 6, pregnantCows: 3,
  totalBulls: 13, fertileBulls: 10,
  totalBreeding: 15, pendingBreeding: 3,
  totalBirths: 15, birthsThisMonth: 2,
  totalDeaths: 15, deathsThisMonth: 0,
  totalPurchases: 15, totalSales: 15,
  totalProfit: 285000, totalLoss: 110000,
  recentActivity: [
    { icon: '🐄', text: 'New cattle GVF-030 (Karim) added', time: '2 hours ago', color: 'var(--green-light)' },
    { icon: '🥛', text: 'Milk updated — Roshni: 13.5 L/day', time: '5 hours ago', color: 'var(--blue)' },
    { icon: '💰', text: 'Sultan sold for ₨210,000', time: '1 day ago', color: 'var(--amber)' },
    { icon: '🐣', text: 'New calf born — Calf15 (Cholistani)', time: '3 days ago', color: 'var(--green-mid)' },
    { icon: '⚖️', text: 'Weight recorded — Bahadur: 500 kg', time: '5 days ago', color: 'var(--brown)' },
  ]
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(r => setStats(r.data))
      .catch(() => setStats(MOCK))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading text="Loading dashboard..." />;
  const s = stats || MOCK;

  const today = new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const hour = new Date().getHours();

  let greeting = "Good Evening";
  let emoji = "🌙";

  if (hour < 12) {
    greeting = "Good Morning";
    emoji = "🌞";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
    emoji = "☀️";
  } else if (hour < 22) {
    greeting = "Good Evening";
    emoji = "🌅";
  } else {
    greeting = "Good Night";
    emoji = "🌙";
  }

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--green-dark) 0%, var(--green-mid) 60%, #74c69d 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px 36px',
        marginBottom: 28,
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', right: 20, top: -10, fontSize: 120, opacity: 0.1 }}>🌾</div>
        <div>
          <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 30, fontWeight: 800 }}>
            {emoji} {greeting}, Ahmad!
          </div>
          <div style={{ fontSize: 15, opacity: 0.85, marginTop: 4, fontWeight: 600 }}>{today}</div>
          <div style={{ marginTop: 14, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,255,255,0.18)', padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 800 }}>
              🌾 Green Valley Farm
            </span>
            <span style={{ background: 'rgba(255,255,255,0.18)', padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 800 }}>
              🐄 {s.activeCattle} Active Cattle
            </span>
            <span style={{ background: 'rgba(244,162,97,0.35)', padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 800 }}>
              ✅ Farm Running Normally
            </span>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <h2 className="section-title">📊 Farm Overview</h2>
      <div className="stats-grid">
        <div className="stat-card green">
          <div className="stat-icon">🐄</div>
          <div className="stat-info">
            <div className="stat-num">{s.activeCattle}</div>
            <div className="stat-label">Active Cattle</div>
          </div>
        </div>
        <div className="stat-card amber">
          <div className="stat-icon">🥛</div>
          <div className="stat-info">
            <div className="stat-num">{s.lactatingCows}</div>
            <div className="stat-label">Lactating Cows</div>
          </div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon">🪦</div>
          <div className="stat-info">
            <div className="stat-num">{s.pregnantCows}</div>
            <div className="stat-label">Pregnant Cows</div>
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">🐂</div>
          <div className="stat-info">
            <div className="stat-num">{s.fertileBulls}</div>
            <div className="stat-label">Fertile Bulls</div>
          </div>
        </div>
        <div className="stat-card amber">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <div className="stat-num">{s.pendingBreeding}</div>
            <div className="stat-label">Pending Breedings</div>
          </div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon">⚰️</div>
          <div className="stat-info">
            <div className="stat-num">{s.deathsThisMonth}</div>
            <div className="stat-label">Deaths This Month</div>
          </div>
        </div>
      </div>

      {/* Finance + Cattle split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

        {/* Finance Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">💰 Finance Summary</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--green-pale)', borderRadius: 'var(--radius-sm)', padding: '14px 18px' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: 1 }}>Total Profit</div>
                <div style={{ fontFamily: 'Baloo 2,cursive', fontSize: 26, color: 'var(--green-dark)' }}>₨ {s.totalProfit?.toLocaleString()}</div>
              </div>
              <span style={{ fontSize: 36 }}>📈</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--red-pale)', borderRadius: 'var(--radius-sm)', padding: '14px 18px' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: 1 }}>Total Loss</div>
                <div style={{ fontFamily: 'Baloo 2,cursive', fontSize: 26, color: 'var(--red)' }}>₨ {s.totalLoss?.toLocaleString()}</div>
              </div>
              <span style={{ fontSize: 36 }}>📉</span>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1, background: '#fff4e6', borderRadius: 'var(--radius-sm)', padding: '12px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase' }}>Purchases</div>
                <div style={{ fontFamily: 'Baloo 2,cursive', fontSize: 22 }}>{s.totalPurchases}</div>
              </div>
              <div style={{ flex: 1, background: 'var(--blue-pale)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase' }}>Sales</div>
                <div style={{ fontFamily: 'Baloo 2,cursive', fontSize: 22 }}>{s.totalSales}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cattle Breakdown */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🐄 Cattle Breakdown</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Active Cattle',   val: s.activeCattle,  total: s.totalCattle, color: 'var(--green-mid)', icon: '🟢' },
              { label: 'Sold Cattle',     val: s.soldCattle,    total: s.totalCattle, color: 'var(--amber)',     icon: '💰' },
              { label: 'Dead Cattle',     val: s.deadCattle,    total: s.totalCattle, color: 'var(--red)',       icon: '⚰️' },
              { label: 'Total Cows',      val: s.totalCows,     total: s.totalCattle, color: 'var(--blue)',      icon: '🥛' },
              { label: 'Total Bulls',     val: s.totalBulls,    total: s.totalCattle, color: 'var(--brown)',     icon: '🐂' },
            ].map(row => (
              <div key={row.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13, fontWeight: 700 }}>
                  <span>{row.icon} {row.label}</span>
                  <span style={{ color: 'var(--text-mid)' }}>{row.val} / {row.total}</span>
                </div>
                <div style={{ height: 8, background: 'var(--cream-dark)', borderRadius: 999 }}>
                  <div style={{ height: 8, width: `${(row.val / row.total) * 100}%`, background: row.color, borderRadius: 999, transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">🕐 Recent Activity</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {s.recentActivity?.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: i % 2 === 0 ? 'var(--cream)' : 'white' }}>
              <div style={{ width: 40, height: 40, background: 'var(--green-pale)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                {a.icon}
              </div>
              <div style={{ flex: 1, fontWeight: 700, fontSize: 14 }}>{a.text}</div>
              <div style={{ fontSize: 12, color: 'var(--text-light)', fontWeight: 700, whiteSpace: 'nowrap' }}>{a.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}