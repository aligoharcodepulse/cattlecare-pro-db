// ============================================================
//  BullsPage.jsx
// ============================================================
import React, { useEffect, useState } from 'react';
import { getAllBulls, updateBull } from '../api';
import { Modal, SearchBar, StatusBadge, Loading, EmptyState, Field, useToast } from '../components/UI';

const MOCK_BULLS = [
  { CattleID: 9,  TagNumber: 'GVF-009', Name: 'Sultan',   Breed: 'Sahiwal',    FertilityStatus: 'Fertile',   SemenQuality: 'Excellent' },
  { CattleID: 10, TagNumber: 'GVF-010', Name: 'Bahadur',  Breed: 'Nili-Ravi',  FertilityStatus: 'Fertile',   SemenQuality: 'Good' },
  { CattleID: 11, TagNumber: 'GVF-011', Name: 'Shehzada', Breed: 'Cholistani', FertilityStatus: 'Fertile',   SemenQuality: 'Good' },
  { CattleID: 12, TagNumber: 'GVF-012', Name: 'Rustam',   Breed: 'Cholistani', FertilityStatus: 'Fertile',   SemenQuality: 'Excellent' },
  { CattleID: 20, TagNumber: 'GVF-020', Name: 'Badal',    Breed: 'Cholistani', FertilityStatus: 'Infertile', SemenQuality: 'Poor' },
];

export function BullsPage() {
  const toast = useToast();
  const [bulls, setBulls]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [showEdit, setEdit]   = useState(false);
  const [selected, setSel]    = useState(null);
  const [form, setForm]       = useState({});
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    getAllBulls().then(r => setBulls(r.data)).catch(() => setBulls(MOCK_BULLS)).finally(() => setLoading(false));
  }, []);

  const filtered = bulls.filter(b => !search || [b.Name, b.TagNumber, b.Breed].some(v => v?.toLowerCase().includes(search.toLowerCase())));
  const fertile = bulls.filter(b => b.FertilityStatus === 'Fertile').length;

  if (loading) return <Loading text="Loading bulls..." />;

  return (
    <div>
      <h2 className="section-title">🐂 Bulls</h2>
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card green"><div className="stat-icon">🐂</div><div className="stat-info"><div className="stat-num">{bulls.length}</div><div className="stat-label">Total Bulls</div></div></div>
        <div className="stat-card green"><div className="stat-icon">💚</div><div className="stat-info"><div className="stat-num">{fertile}</div><div className="stat-label">Fertile</div></div></div>
        <div className="stat-card red"><div className="stat-icon">❌</div><div className="stat-info"><div className="stat-num">{bulls.filter(b => b.FertilityStatus === 'Infertile').length}</div><div className="stat-label">Infertile</div></div></div>
      </div>
      <div className="card" style={{ marginBottom: 20, padding: '14px 20px' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search bulls..." />
      </div>
      {filtered.length === 0
        ? <EmptyState icon="🐂" title="No bulls found" />
        : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map(b => (
            <div key={b.CattleID} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 52, height: 52, background: '#fff4e6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🐂</div>
                <div>
                  <div style={{ fontFamily: 'Baloo 2,cursive', fontSize: 18 }}>{b.Name || '—'}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-light)', fontWeight: 700 }}>#{b.CattleID} · {b.TagNumber} · {b.Breed}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--cream)', padding: '8px 12px', borderRadius: 8 }}>
                  <span style={{ fontWeight: 800, fontSize: 13 }}>💚 Fertility</span>
                  <StatusBadge status={b.FertilityStatus} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--cream)', padding: '8px 12px', borderRadius: 8 }}>
                  <span style={{ fontWeight: 800, fontSize: 13 }}>🔬 Semen Quality</span>
                  <span className={`badge ${b.SemenQuality === 'Excellent' ? 'badge-green' : b.SemenQuality === 'Good' ? 'badge-blue' : b.SemenQuality === 'Poor' ? 'badge-red' : 'badge-grey'}`}>{b.SemenQuality}</span>
                </div>
              </div>
              <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => { setSel(b); setForm({ FertilityStatus: b.FertilityStatus, SemenQuality: b.SemenQuality }); setEdit(true); }}>✏️ Update Status</button>
            </div>
          ))}
        </div>
      )}
      <Modal open={showEdit} title={`Update — ${selected?.Name}`} icon="🐂" onClose={() => setEdit(false)}
        footer={<><button className="btn btn-ghost" onClick={() => setEdit(false)}>Cancel</button><button className="btn btn-primary" onClick={async () => { setSaving(true); try { await updateBull(selected.CattleID, form); setBulls(p => p.map(b => b.CattleID === selected.CattleID ? { ...b, ...form } : b)); toast('✅ Updated!'); setEdit(false); } catch { toast('Failed', 'error'); } finally { setSaving(false); } }} disabled={saving}>{saving ? '⏳...' : '💾 Save'}</button></>}>
        <div className="form-grid">
          <Field label="Fertility Status" icon="💚">
            <select className="form-control" value={form.FertilityStatus} onChange={e => setForm(p => ({ ...p, FertilityStatus: e.target.value }))}>
              <option value="Fertile">💚 Fertile</option><option value="Infertile">❌ Infertile</option><option value="Unknown">❓ Unknown</option>
            </select>
          </Field>
          <Field label="Semen Quality" icon="🔬">
            <select className="form-control" value={form.SemenQuality} onChange={e => setForm(p => ({ ...p, SemenQuality: e.target.value }))}>
              <option value="Excellent">⭐ Excellent</option><option value="Good">👍 Good</option><option value="Poor">👎 Poor</option><option value="Unknown">❓ Unknown</option>
            </select>
          </Field>
        </div>
      </Modal>
    </div>
  );
}


// ============================================================
//  BreedingPage.jsx
// ============================================================
import { getAllBreeding, addBreeding, updateBreeding } from '../api';

const MOCK_BREEDING = [
  { BreedingID: 1,  CowName: 'Roshni',  BullName: 'Sultan',   BreedingDate: '2022-06-15', Method: 'Natural', ExpectedDueDate: '2023-03-25', Outcome: 'Successful' },
  { BreedingID: 2,  CowName: 'Champa',  BullName: 'Bahadur',  BreedingDate: '2022-09-01', Method: 'Natural', ExpectedDueDate: '2023-06-10', Outcome: 'Successful' },
  { BreedingID: 3,  CowName: 'Gulabo',  BullName: 'Sultan',   BreedingDate: '2023-01-20', Method: 'AI',      ExpectedDueDate: '2023-10-30', Outcome: 'Successful' },
  { BreedingID: 6,  CowName: 'Heer',    BullName: 'Bahadur',  BreedingDate: '2023-03-18', Method: 'AI',      ExpectedDueDate: '2023-12-27', Outcome: 'Pending' },
  { BreedingID: 11, CowName: 'Motia',   BullName: 'Shehzada', BreedingDate: '2021-01-05', Method: 'AI',      ExpectedDueDate: '2021-10-14', Outcome: 'Failed' },
  { BreedingID: 15, CowName: 'Sheeri',  BullName: 'Rustam',   BreedingDate: '2023-05-01', Method: 'Natural', ExpectedDueDate: '2024-02-08', Outcome: 'Pending' },
];

const EMPTY_BR = { CowID: '', BullID: '', BreedingDate: '', Method: 'Natural', ExpectedDueDate: '' };

export function BreedingPage() {
  const toast = useToast();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setAdd]     = useState(false);
  const [form, setForm]       = useState(EMPTY_BR);
  const [saving, setSaving]   = useState(false);
  const [filterOut, setOut]   = useState('All');

  useEffect(() => {
    getAllBreeding().then(r => setRecords(r.data)).catch(() => setRecords(MOCK_BREEDING)).finally(() => setLoading(false));
  }, []);

  const filtered = records.filter(r => filterOut === 'All' || r.Outcome === filterOut);

  async function handleAdd() {
    if (!form.CowID || !form.BullID || !form.BreedingDate) { toast('Fill required fields', 'error'); return; }
    setSaving(true);
    try {
      const r = await addBreeding(form);
      setRecords(p => [...p, { ...form, BreedingID: r.data?.BreedingID || Date.now(), CowName: `CowID:${form.CowID}`, BullName: `BullID:${form.BullID}`, Outcome: 'Pending' }]);
      toast('✅ Breeding recorded!');
      setAdd(false); setForm(EMPTY_BR);
    } catch { toast('Failed to record', 'error'); }
    finally { setSaving(false); }
  }

  if (loading) return <Loading text="Loading breeding records..." />;

  const pending    = records.filter(r => r.Outcome === 'Pending').length;
  const successful = records.filter(r => r.Outcome === 'Successful').length;
  const failed     = records.filter(r => r.Outcome === 'Failed').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h2 className="section-title">💑 Breeding Records</h2>
        <button className="btn btn-primary" onClick={() => setAdd(true)}>➕ Record Breeding</button>
      </div>
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card amber"><div className="stat-icon">⏳</div><div className="stat-info"><div className="stat-num">{pending}</div><div className="stat-label">Pending</div></div></div>
        <div className="stat-card green"><div className="stat-icon">✅</div><div className="stat-info"><div className="stat-num">{successful}</div><div className="stat-label">Successful</div></div></div>
        <div className="stat-card red"><div className="stat-icon">❌</div><div className="stat-info"><div className="stat-num">{failed}</div><div className="stat-label">Failed</div></div></div>
      </div>
      <div className="card" style={{ marginBottom: 20, padding: '14px 20px' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['All', 'Pending', 'Successful', 'Failed'].map(s => (
            <button key={s} className={`btn btn-sm ${filterOut === s ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setOut(s)}>{s}</button>
          ))}
        </div>
      </div>
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>🐄 Cow</th><th>🐂 Bull</th><th>📅 Date</th><th>💉 Method</th><th>🗓️ Due Date</th><th>📌 Outcome</th><th>⚙️</th></tr></thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.BreedingID}>
                  <td style={{ fontWeight: 800 }}>🐄 {r.CowName}</td>
                  <td style={{ fontWeight: 800 }}>🐂 {r.BullName}</td>
                  <td>{r.BreedingDate ? new Date(r.BreedingDate).toLocaleDateString('en-PK') : '—'}</td>
                  <td><span className={`badge ${r.Method === 'AI' ? 'badge-blue' : 'badge-green'}`}>{r.Method === 'AI' ? '💉 AI' : '🌿 Natural'}</span></td>
                  <td>{r.ExpectedDueDate ? new Date(r.ExpectedDueDate).toLocaleDateString('en-PK') : '—'}</td>
                  <td><StatusBadge status={r.Outcome} /></td>
                  <td>
                    <select className="form-control" style={{ padding: '5px 10px', fontSize: 12, width: 130 }} value={r.Outcome}
                      onChange={async e => {
                        try { await updateBreeding(r.BreedingID, { Outcome: e.target.value }); setRecords(p => p.map(x => x.BreedingID === r.BreedingID ? { ...x, Outcome: e.target.value } : x)); toast('Updated!'); } catch { toast('Failed', 'error'); }
                      }}>
                      <option value="Pending">Pending</option><option value="Successful">Successful</option><option value="Failed">Failed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={showAdd} title="Record New Breeding" icon="💑" onClose={() => setAdd(false)}
        footer={<><button className="btn btn-ghost" onClick={() => setAdd(false)}>Cancel</button><button className="btn btn-primary" onClick={handleAdd} disabled={saving}>{saving ? '⏳...' : '✅ Record'}</button></>}>
        <div className="form-grid">
          <Field label="Cow ID" icon="🐄" required><input className="form-control" type="number" value={form.CowID} onChange={e => setForm(p => ({ ...p, CowID: e.target.value }))} placeholder="Enter Cow's CattleID" /></Field>
          <Field label="Bull ID" icon="🐂" required><input className="form-control" type="number" value={form.BullID} onChange={e => setForm(p => ({ ...p, BullID: e.target.value }))} placeholder="Enter Bull's CattleID" /></Field>
          <Field label="Breeding Date" icon="📅" required><input className="form-control" type="date" value={form.BreedingDate} onChange={e => setForm(p => ({ ...p, BreedingDate: e.target.value }))} /></Field>
          <Field label="Method" icon="💉"><select className="form-control" value={form.Method} onChange={e => setForm(p => ({ ...p, Method: e.target.value }))}><option value="Natural">🌿 Natural</option><option value="AI">💉 Artificial Insemination</option></select></Field>
          <Field label="Expected Due Date" icon="🗓️"><input className="form-control" type="date" value={form.ExpectedDueDate} onChange={e => setForm(p => ({ ...p, ExpectedDueDate: e.target.value }))} /></Field>
        </div>
      </Modal>
    </div>
  );
}


// ============================================================
//  BirthsPage.jsx
// ============================================================
import { getAllBirths, addBirth } from '../api';

const MOCK_BIRTHS = [
  { BirthID: 1, MotherName: 'Roshni',  CalfTag: 'GVF-C07', BirthDate: '2023-03-25', BirthWeight: 28.5, Complications: null },
  { BirthID: 2, MotherName: 'Champa',  CalfTag: 'GVF-C08', BirthDate: '2023-06-10', BirthWeight: 32.0, Complications: null },
  { BirthID: 3, MotherName: 'Motia',   CalfTag: 'GVF-017', BirthDate: '2023-04-02', BirthWeight: 26.0, Complications: 'Mild dystocia' },
  { BirthID: 4, MotherName: 'Laila',   CalfTag: 'GVF-C06', BirthDate: '2023-01-14', BirthWeight: 30.5, Complications: null },
  { BirthID: 5, MotherName: 'Nargis',  CalfTag: 'GVF-C09', BirthDate: '2023-04-04', BirthWeight: 27.0, Complications: null },
];

const EMPTY_BIRTH = { MotherID: '', CalfID: '', BreedingID: '', BirthDate: '', BirthWeight: '', Complications: '' };

export function BirthsPage() {
  const toast = useToast();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setAdd]     = useState(false);
  const [form, setForm]       = useState(EMPTY_BIRTH);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    getAllBirths().then(r => setRecords(r.data)).catch(() => setRecords(MOCK_BIRTHS)).finally(() => setLoading(false));
  }, []);

  async function handleAdd() {
    if (!form.MotherID || !form.CalfID || !form.BirthDate) { toast('Fill required fields', 'error'); return; }
    setSaving(true);
    try {
      const r = await addBirth(form);
      setRecords(p => [...p, { ...form, BirthID: r.data?.BirthID || Date.now(), MotherName: `CowID:${form.MotherID}`, CalfTag: `CattleID:${form.CalfID}` }]);
      toast('🐣 Birth recorded!');
      setAdd(false); setForm(EMPTY_BIRTH);
    } catch { toast('Failed', 'error'); }
    finally { setSaving(false); }
  }

  if (loading) return <Loading text="Loading birth records..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="section-title">🐣 Birth Records</h2>
          <div style={{ fontSize: 13, color: 'var(--text-light)', fontWeight: 700 }}>{records.length} total births recorded</div>
        </div>
        <button className="btn btn-primary" onClick={() => setAdd(true)}>➕ Record Birth</button>
      </div>
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>🐄 Mother</th><th>🏷️ Calf Tag</th><th>📅 Birth Date</th><th>⚖️ Birth Weight</th><th>⚠️ Complications</th></tr></thead>
            <tbody>
              {records.map(r => (
                <tr key={r.BirthID}>
                  <td style={{ fontWeight: 800 }}>🐄 {r.MotherName}</td>
                  <td><span style={{ fontFamily: 'monospace', background: 'var(--cream-dark)', padding: '3px 8px', borderRadius: 6, fontWeight: 800 }}>{r.CalfTag}</span></td>
                  <td>{r.BirthDate ? new Date(r.BirthDate).toLocaleDateString('en-PK') : '—'}</td>
                  <td><strong>{r.BirthWeight} kg</strong></td>
                  <td>{r.Complications ? <span className="badge badge-red">⚠️ {r.Complications}</span> : <span className="badge badge-green">✅ Normal</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={showAdd} title="Record New Birth" icon="🐣" onClose={() => setAdd(false)}
        footer={<><button className="btn btn-ghost" onClick={() => setAdd(false)}>Cancel</button><button className="btn btn-primary" onClick={handleAdd} disabled={saving}>{saving ? '⏳...' : '✅ Record'}</button></>}>
        <div className="form-grid">
          <Field label="Mother (Cow CattleID)" icon="🐄" required><input className="form-control" type="number" value={form.MotherID} onChange={e => setForm(p => ({ ...p, MotherID: e.target.value }))} placeholder="Mother's CattleID" /></Field>
          <Field label="Calf (CattleID)" icon="🐣" required><input className="form-control" type="number" value={form.CalfID} onChange={e => setForm(p => ({ ...p, CalfID: e.target.value }))} placeholder="Calf must be pre-added" /></Field>
          <Field label="Breeding Record ID" icon="💑"><input className="form-control" type="number" value={form.BreedingID} onChange={e => setForm(p => ({ ...p, BreedingID: e.target.value }))} placeholder="Optional" /></Field>
          <Field label="Birth Date" icon="📅" required><input className="form-control" type="date" value={form.BirthDate} onChange={e => setForm(p => ({ ...p, BirthDate: e.target.value }))} /></Field>
          <Field label="Birth Weight (kg)" icon="⚖️"><input className="form-control" type="number" step="0.1" value={form.BirthWeight} onChange={e => setForm(p => ({ ...p, BirthWeight: e.target.value }))} placeholder="e.g. 28.5" /></Field>
          <Field label="Complications" icon="⚠️">
            <input className="form-control" value={form.Complications} onChange={e => setForm(p => ({ ...p, Complications: e.target.value }))} placeholder="Leave blank if none" />
          </Field>
        </div>
      </Modal>
    </div>
  );
}


// ============================================================
//  DeathsPage.jsx
// ============================================================
import { getAllDeaths, addDeath } from '../api';

const MOCK_DEATHS = [
  { DeathID: 1, CattleName: 'Badal',    TagNumber: 'GVF-020', DeathDate: '2023-02-14', Cause: 'Respiratory infection', VetVerified: 1 },
  { DeathID: 2, CattleName: 'OldCow1',  TagNumber: 'GVF-H01', DeathDate: '2018-06-10', Cause: 'Old age',               VetVerified: 1 },
  { DeathID: 3, CattleName: 'OldBull1', TagNumber: 'GVF-H02', DeathDate: '2019-03-22', Cause: 'Foot and mouth disease', VetVerified: 1 },
];

const EMPTY_DEATH = { CattleID: '', DeathDate: '', Cause: '', VetVerified: 0 };

export function DeathsPage() {
  const toast = useToast();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setAdd]     = useState(false);
  const [form, setForm]       = useState(EMPTY_DEATH);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    getAllDeaths().then(r => setRecords(r.data)).catch(() => setRecords(MOCK_DEATHS)).finally(() => setLoading(false));
  }, []);

  async function handleAdd() {
    if (!form.CattleID || !form.DeathDate) { toast('Fill required fields', 'error'); return; }
    setSaving(true);
    try {
      const r = await addDeath(form);
      setRecords(p => [...p, { ...form, DeathID: r.data?.DeathID || Date.now(), CattleName: `CattleID:${form.CattleID}`, TagNumber: '—' }]);
      toast('🪦 Death recorded. Cattle status auto-updated.');
      setAdd(false); setForm(EMPTY_DEATH);
    } catch { toast('Failed', 'error'); }
    finally { setSaving(false); }
  }

  if (loading) return <Loading text="Loading death records..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h2 className="section-title">⚰️ Death Records</h2>
        <button className="btn btn-danger" onClick={() => setAdd(true)}>➕ Record Death</button>
      </div>
      <div style={{ background: 'var(--red-pale)', border: '2px solid #ffb3b3', borderRadius: 'var(--radius-md)', padding: '14px 20px', marginBottom: 20, fontWeight: 700, fontSize: 14, color: '#b00020' }}>
        ⚠️ Recording a death will automatically update the cattle's status to "Dead" in the system.
      </div>
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>🐄 Cattle</th><th>🏷️ Tag</th><th>📅 Death Date</th><th>💀 Cause</th><th>👨‍⚕️ Vet Verified</th></tr></thead>
            <tbody>
              {records.map(r => (
                <tr key={r.DeathID}>
                  <td style={{ fontWeight: 800 }}>{r.CattleName}</td>
                  <td><span style={{ fontFamily: 'monospace', background: 'var(--cream-dark)', padding: '3px 8px', borderRadius: 6, fontWeight: 800 }}>{r.TagNumber}</span></td>
                  <td>{r.DeathDate ? new Date(r.DeathDate).toLocaleDateString('en-PK') : '—'}</td>
                  <td>{r.Cause || '—'}</td>
                  <td>{r.VetVerified ? <span className="badge badge-green">✅ Verified</span> : <span className="badge badge-amber">⏳ Pending</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={showAdd} title="Record Death" icon="🪦" onClose={() => setAdd(false)}
        footer={<><button className="btn btn-ghost" onClick={() => setAdd(false)}>Cancel</button><button className="btn btn-danger" onClick={handleAdd} disabled={saving}>{saving ? '⏳...' : '🪦 Record'}</button></>}>
        <div style={{ background: 'var(--red-pale)', border: '2px solid #ffb3b3', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 20, fontSize: 13, fontWeight: 700, color: '#b00020' }}>
          This action will permanently mark the cattle as Dead.
        </div>
        <div className="form-grid">
          <Field label="Cattle ID" icon="🐄" required><input className="form-control" type="number" value={form.CattleID} onChange={e => setForm(p => ({ ...p, CattleID: e.target.value }))} placeholder="CattleID from database" /></Field>
          <Field label="Date of Death" icon="📅" required><input className="form-control" type="date" value={form.DeathDate} onChange={e => setForm(p => ({ ...p, DeathDate: e.target.value }))} /></Field>
          <Field label="Cause of Death" icon="💀"><input className="form-control" value={form.Cause} onChange={e => setForm(p => ({ ...p, Cause: e.target.value }))} placeholder="e.g. Tick fever, Old age" /></Field>
          <Field label="Vet Verified?" icon="👨‍⚕️">
            <select className="form-control" value={form.VetVerified} onChange={e => setForm(p => ({ ...p, VetVerified: e.target.value }))}>
              <option value={0}>⏳ Not Yet</option><option value={1}>✅ Yes, Verified</option>
            </select>
          </Field>
        </div>
      </Modal>
    </div>
  );
}