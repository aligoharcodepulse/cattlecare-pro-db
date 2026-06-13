import React, { useEffect, useState } from 'react';
import { getAllCows, updateCow } from '../api';
import { Modal, SearchBar, StatusBadge, Loading, EmptyState, Field, useToast } from '../components/UI';

const MOCK = [
  { CattleID: 1, TagNumber: 'GVF-001', Name: 'Roshni',  Breed: 'Sahiwal',    MilkProduction: 13.50, LactationStatus: 'Lactating', LastCalvingDate: '2023-04-02' },
  { CattleID: 2, TagNumber: 'GVF-002', Name: 'Champa',  Breed: 'Nili-Ravi',  MilkProduction: 15.00, LactationStatus: 'Lactating', LastCalvingDate: '2023-07-18' },
  { CattleID: 3, TagNumber: 'GVF-003', Name: 'Gulabo',  Breed: 'Sahiwal',    MilkProduction: 8.00,  LactationStatus: 'Dry',       LastCalvingDate: null },
  { CattleID: 4, TagNumber: 'GVF-004', Name: 'Motia',   Breed: 'Cholistani', MilkProduction: 10.00, LactationStatus: 'Pregnant',  LastCalvingDate: '2022-06-15' },
  { CattleID: 5, TagNumber: 'GVF-005', Name: 'Laila',   Breed: 'Nili-Ravi',  MilkProduction: 14.50, LactationStatus: 'Lactating', LastCalvingDate: '2023-01-10' },
  { CattleID: 6, TagNumber: 'GVF-006', Name: 'Heer',    Breed: 'Sahiwal',    MilkProduction: 0.00,  LactationStatus: 'Dry',       LastCalvingDate: null },
  { CattleID: 7, TagNumber: 'GVF-007', Name: 'Nargis',  Breed: 'Cholistani', MilkProduction: 9.50,  LactationStatus: 'Pregnant',  LastCalvingDate: '2022-09-20' },
  { CattleID: 8, TagNumber: 'GVF-008', Name: 'Sona',    Breed: 'Nili-Ravi',  MilkProduction: 13.00, LactationStatus: 'Lactating', LastCalvingDate: '2023-03-05' },
];

export default function CowsPage() {
  const toast = useToast();
  const [cows, setCows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [filterLact, setLact] = useState('All');
  const [showEdit, setEdit]   = useState(false);
  const [selected, setSel]    = useState(null);
  const [form, setForm]       = useState({});
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    getAllCows().then(r => setCows(r.data)).catch(() => setCows(MOCK)).finally(() => setLoading(false));
  }, []);

  const filtered = cows.filter(c => {
    const matchS = !search || [c.Name, c.TagNumber, c.Breed].some(v => v?.toLowerCase().includes(search.toLowerCase()));
    const matchL = filterLact === 'All' || c.LactationStatus === filterLact;
    return matchS && matchL;
  });

  const totalMilk = filtered.reduce((sum, c) => sum + (c.LactationStatus === 'Lactating' ? Number(c.MilkProduction) : 0), 0);

  function openEdit(c) {
    setSel(c);
    setForm({ MilkProduction: c.MilkProduction, LactationStatus: c.LactationStatus, LastCalvingDate: c.LastCalvingDate?.split('T')[0] || '' });
    setEdit(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateCow(selected.CattleID, form);
      setCows(prev => prev.map(c => c.CattleID === selected.CattleID ? { ...c, ...form } : c));
      toast('✅ Cow record updated!');
      setEdit(false);
    } catch { toast('Failed to update', 'error'); }
    finally { setSaving(false); }
  }

  if (loading) return <Loading text="Loading cows..." />;

  const lactCount     = cows.filter(c => c.LactationStatus === 'Lactating').length;
  const pregnantCount = cows.filter(c => c.LactationStatus === 'Pregnant').length;
  const dryCount      = cows.filter(c => c.LactationStatus === 'Dry').length;

  return (
    <div>
      <h2 className="section-title">🥛 Cows & Milk Production</h2>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card green">
          <div className="stat-icon">🥛</div>
          <div className="stat-info"><div className="stat-num">{totalMilk.toFixed(1)} L</div><div className="stat-label">Daily Milk (Active)</div></div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">🍼</div>
          <div className="stat-info"><div className="stat-num">{lactCount}</div><div className="stat-label">Lactating</div></div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon">🪦</div>
          <div className="stat-info"><div className="stat-num">{pregnantCount}</div><div className="stat-label">Pregnant</div></div>
        </div>
        <div className="stat-card amber">
          <div className="stat-icon">⏸️</div>
          <div className="stat-info"><div className="stat-num">{dryCount}</div><div className="stat-label">Dry</div></div>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20, padding: '14px 20px' }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search cows..." />
          <div style={{ display: 'flex', gap: 8 }}>
            {['All', 'Lactating', 'Pregnant', 'Dry'].map(s => (
              <button key={s} className={`btn btn-sm ${filterLact === s ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setLact(s)}>{s}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {filtered.length === 0
        ? <EmptyState icon="🐄" title="No cows found" subtitle="Try changing your filters" />
        : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filtered.map(cow => (
            <div key={cow.CattleID} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 52, height: 52, background: 'var(--green-pale)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🐄</div>
                  <div>
                    <div style={{ fontFamily: 'Baloo 2,cursive', fontSize: 18, color: 'var(--green-dark)' }}>{cow.Name || '—'}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-light)', fontWeight: 700 }}>#{cow.CattleID} · {cow.TagNumber} · {cow.Breed}</div>
                  </div>
                </div>
                <StatusBadge status={cow.LactationStatus} />
              </div>

              {/* Milk Bar */}
              <div style={{ background: 'var(--cream)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-mid)' }}>🥛 Daily Milk</span>
                  <span style={{ fontFamily: 'Baloo 2,cursive', fontSize: 18, color: 'var(--green-dark)' }}>{Number(cow.MilkProduction)?.toFixed(1) ?? '0.0'} L</span>
                </div>
                <div style={{ height: 8, background: 'var(--cream-dark)', borderRadius: 999 }}>
                  <div style={{ height: 8, width: `${Math.min((cow.MilkProduction / 20) * 100, 100)}%`, background: cow.LactationStatus === 'Lactating' ? 'var(--green-light)' : 'var(--cream-dark)', borderRadius: 999 }} />
                </div>
              </div>

              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-light)', marginBottom: 12 }}>
                🗓️ Last Calving: {cow.LastCalvingDate ? new Date(cow.LastCalvingDate).toLocaleDateString('en-PK') : 'Not yet'}
              </div>

              <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => openEdit(cow)}>✏️ Update Milk & Status</button>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal open={showEdit} title={`Update — ${selected?.Name}`} icon="🥛" onClose={() => setEdit(false)}
        footer={<><button className="btn btn-ghost" onClick={() => setEdit(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? '⏳...' : '💾 Save'}</button></>}>
        <div className="form-grid">
          <Field label="Daily Milk Production (Litres)" icon="🥛">
            <input className="form-control" type="number" step="0.5" min="0" value={form.MilkProduction} onChange={e => setForm(p => ({ ...p, MilkProduction: e.target.value }))} />
          </Field>
          <Field label="Lactation Status" icon="📌">
            <select className="form-control" value={form.LactationStatus} onChange={e => setForm(p => ({ ...p, LactationStatus: e.target.value }))}>
              <option value="Lactating">🍼 Lactating</option>
              <option value="Dry">⏸️ Dry</option>
              <option value="Pregnant">🤰 Pregnant</option>
            </select>
          </Field>
          <Field label="Last Calving Date" icon="🗓️">
            <input className="form-control" type="date" value={form.LastCalvingDate} onChange={e => setForm(p => ({ ...p, LastCalvingDate: e.target.value }))} />
          </Field>
        </div>
      </Modal>
    </div>
  );
}