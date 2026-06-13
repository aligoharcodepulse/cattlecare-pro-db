import React, { useEffect, useState } from 'react';
import { getAllCattle, addCattle, updateCattle, deleteCattle, getCattleProfile } from '../api';
import { Modal, ConfirmModal, SearchBar, StatusBadge, Loading, EmptyState, Field, useToast } from '../components/UI';

const MOCK_CATTLE = [
  { CattleID: 1, TagNumber: 'GVF-001', Name: 'Roshni',   Breed: 'Sahiwal',    Gender: 'Female', DateOfBirth: '2019-03-15', Status: 'Active', FarmName: 'Green Valley Farm' },
  { CattleID: 2, TagNumber: 'GVF-002', Name: 'Champa',   Breed: 'Nili-Ravi',  Gender: 'Female', DateOfBirth: '2018-07-22', Status: 'Active', FarmName: 'Green Valley Farm' },
  { CattleID: 3, TagNumber: 'GVF-003', Name: 'Gulabo',   Breed: 'Sahiwal',    Gender: 'Female', DateOfBirth: '2020-01-10', Status: 'Active', FarmName: 'Green Valley Farm' },
  { CattleID: 4, TagNumber: 'GVF-004', Name: 'Motia',    Breed: 'Cholistani', Gender: 'Female', DateOfBirth: '2019-11-05', Status: 'Active', FarmName: 'Green Valley Farm' },
  { CattleID: 5, TagNumber: 'GVF-005', Name: 'Laila',    Breed: 'Nili-Ravi',  Gender: 'Female', DateOfBirth: '2017-05-18', Status: 'Active', FarmName: 'Green Valley Farm' },
  { CattleID: 9, TagNumber: 'GVF-009', Name: 'Sultan',   Breed: 'Sahiwal',    Gender: 'Male',   DateOfBirth: '2017-04-10', Status: 'Sold',   FarmName: 'Green Valley Farm' },
  { CattleID: 10,TagNumber: 'GVF-010', Name: 'Bahadur',  Breed: 'Nili-Ravi',  Gender: 'Male',   DateOfBirth: '2018-09-25', Status: 'Active', FarmName: 'Green Valley Farm' },
  { CattleID: 17,TagNumber: 'GVF-020', Name: 'Badal',    Breed: 'Cholistani', Gender: 'Male',   DateOfBirth: '2015-05-14', Status: 'Dead',   FarmName: 'Green Valley Farm' },
];

const EMPTY_FORM = { TagNumber: '', Name: '', Breed: '', Gender: 'Female', DateOfBirth: '', Status: 'Active' };

function calcAge(dob) {
  if (!dob) return '—';
  const diff = Date.now() - new Date(dob).getTime();
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
  return years > 0 ? `${years} yr ${months} mo` : `${months} months`;
}


// ✅ MOVE THIS outside — above the main component
function FormBody({ form, onChange }) {
  return (
    <div className="form-grid">
      <Field label="Tag Number" icon="🏷️" required>
        <input className="form-control" 
          value={form.TagNumber} 
          onChange={e => onChange('TagNumber', e.target.value)} 
          placeholder="e.g. GVF-031" />
      </Field>
      <Field label="Name" icon="📛">
        <input className="form-control" 
          value={form.Name} 
          onChange={e => onChange('Name', e.target.value)} 
          placeholder="e.g. Roshni" />
      </Field>
      <Field label="Breed" icon="🧬">
        <select className="form-control" 
          value={form.Breed} 
          onChange={e => onChange('Breed', e.target.value)}>
          <option value="">-- Select Breed --</option>
          <option>Sahiwal</option>
          <option>Nili-Ravi</option>
          <option>Cholistani</option>
          <option>Achai</option>
          <option>Dajal</option>
          <option>Crossbred</option>
        </select>
      </Field>
      <Field label="Gender" icon="⚧️" required>
        <select className="form-control" 
          value={form.Gender} 
          onChange={e => onChange('Gender', e.target.value)}>
          <option value="Female">🐄 Female (Cow)</option>
          <option value="Male">🐂 Male (Bull)</option>
        </select>
      </Field>
      <Field label="Date of Birth" icon="🎂">
        <input className="form-control" 
          type="date" 
          value={form.DateOfBirth} 
          onChange={e => onChange('DateOfBirth', e.target.value)} />
      </Field>
      <Field label="Status" icon="📌">
        <select className="form-control" 
          value={form.Status} 
          onChange={e => onChange('Status', e.target.value)}>
          <option value="Active">✅ Active</option>
          <option value="Sold">💰 Sold</option>
          <option value="Dead">🪦 Dead</option>
        </select>
      </Field>
    </div>
  );
}



export default function CattlePage() {
  const toast = useToast();
  const [cattle, setCattle]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [filterStatus, setFilter]   = useState('All');
  const [filterGender, setGender]   = useState('All');
  const [showAdd, setShowAdd]       = useState(false);
  const [showEdit, setShowEdit]     = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showConfirm, setConfirm]   = useState(false);
  const [selected, setSelected]     = useState(null);
  const [profile, setProfile]       = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);

  useEffect(() => {
    getAllCattle()
      .then(r => setCattle(r.data))
      .catch(() => setCattle(MOCK_CATTLE))
      .finally(() => setLoading(false));
  }, []);

  const filtered = cattle.filter(c => {
    const matchSearch = !search || [c.Name, c.TagNumber, c.Breed].some(v => v?.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus === 'All' || c.Status === filterStatus;
    const matchGender = filterGender === 'All' || c.Gender === filterGender;
    return matchSearch && matchStatus && matchGender;
  });

  function openAdd()    { setForm(EMPTY_FORM); setShowAdd(true); }
  function openEdit(c)  { setSelected(c); setForm({ TagNumber: c.TagNumber, Name: c.Name, Breed: c.Breed, Gender: c.Gender, DateOfBirth: c.DateOfBirth?.split('T')[0] || '', Status: c.Status }); setShowEdit(true); }

  async function openProfile(c) {
    setSelected(c);
    setShowProfile(true);
    try {
      const r = await getCattleProfile(c.CattleID);
      setProfile(r.data);
    } catch { setProfile({ cattle: c, weights: [], colors: [] }); }
  }

  async function handleAdd() {
    if (!form.TagNumber || !form.Gender) { toast('Please fill in required fields', 'error'); return; }
    setSaving(true);
    try {
      const r = await addCattle(form);
      setCattle(prev => [...prev, { ...form, CattleID: r.data?.CattleID || Date.now(), FarmName: 'Green Valley Farm' }]);
      toast('✅ Cattle added successfully!');
      setShowAdd(false);
    } catch { toast('Failed to add cattle', 'error'); }
    finally { setSaving(false); }
  }

  async function handleEdit() {
    setSaving(true);
    try {
      await updateCattle(selected.CattleID, form);
      setCattle(prev => prev.map(c => c.CattleID === selected.CattleID ? { ...c, ...form } : c));
      toast('✅ Cattle updated!');
      setShowEdit(false);
    } catch { toast('Failed to update', 'error'); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    try {
      await deleteCattle(selected.CattleID);
      setCattle(prev => prev.filter(c => c.CattleID !== selected.CattleID));
      toast('Cattle removed', 'info');
    } catch { toast('Cannot delete — has related records', 'error'); }
    setConfirm(false);
  }

  const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  if (loading) return <Loading text="Loading cattle records..." />;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="section-title">🐄 All Cattle</h2>
          <div style={{ fontSize: 13, color: 'var(--text-light)', fontWeight: 700 }}>
            Showing {filtered.length} of {cattle.length} cattle
          </div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>➕ Add New Cattle</button>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20, padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name, tag, breed..." />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 800, fontSize: 13, color: 'var(--text-light)' }}>Status:</span>
            {['All', 'Active', 'Sold', 'Dead'].map(s => (
              <button key={s} className={`btn btn-sm ${filterStatus === s ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(s)}>{s}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: 13, color: 'var(--text-light)' }}>Gender:</span>
            {['All', 'Female', 'Male'].map(g => (
              <button key={g} className={`btn btn-sm ${filterGender === g ? 'btn-amber' : 'btn-ghost'}`} onClick={() => setGender(g)}>{g}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0
        ? <EmptyState icon="🐄" title="No cattle found" subtitle="Try changing your search or filters" action={<button className="btn btn-primary" onClick={openAdd}>➕ Add First Cattle</button>} />
        : (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>🆔 ID</th>
                  <th>🏷️ Tag</th>
                  <th>📛 Name</th>
                  <th>🧬 Breed</th>
                  <th>⚧️ Gender</th>
                  <th>🎂 Age</th>
                  <th>📌 Status</th>
                  <th>⚙️ Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.CattleID}>
                    <td style={{ fontWeight: 800, color: 'var(--text-light)' }}>#{c.CattleID}</td>
                    <td><span style={{ fontFamily: 'monospace', background: 'var(--cream-dark)', padding: '3px 8px', borderRadius: 6, fontWeight: 800 }}>{c.TagNumber}</span></td>
                    <td style={{ fontWeight: 800 }}>{c.Gender === 'Female' ? '🐄' : '🐂'} {c.Name || '—'}</td>
                    <td>{c.Breed || '—'}</td>
                    <td><span className={`badge ${c.Gender === 'Female' ? 'badge-blue' : 'badge-amber'}`}>{c.Gender === 'Female' ? '♀ Female' : '♂ Male'}</span></td>
                    <td>{calcAge(c.DateOfBirth)}</td>
                    <td><StatusBadge status={c.Status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-sm btn-ghost" onClick={() => openProfile(c)} title="View Profile">👁️</button>
                        <button className="btn btn-sm btn-outline" onClick={() => openEdit(c)} title="Edit">✏️</button>
                        <button className="btn btn-sm btn-danger" onClick={() => { setSelected(c); setConfirm(true); }} title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      <Modal open={showAdd} title="Add New Cattle" icon="🐄" onClose={() => setShowAdd(false)}
        footer={<><button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button><button className="btn btn-primary" onClick={handleAdd} disabled={saving}>{saving ? '⏳ Saving...' : '✅ Add Cattle'}</button></>}>
        <FormBody  form={form} onChange={f}/>
      </Modal>

      {/* Edit Modal */}
      <Modal open={showEdit} title={`Edit — ${selected?.Name || selected?.TagNumber}`} icon="✏️" onClose={() => setShowEdit(false)}
        footer={<><button className="btn btn-ghost" onClick={() => setShowEdit(false)}>Cancel</button><button className="btn btn-amber" onClick={handleEdit} disabled={saving}>{saving ? '⏳ Saving...' : '💾 Save Changes'}</button></>}>
        <FormBody form={form} onChange={f} />
      </Modal>

      {/* Profile Modal */}
      <Modal open={showProfile} title="Cattle Profile" icon="🐄" onClose={() => { setShowProfile(false); setProfile(null); }}>
        {!profile
          ? <Loading text="Loading profile..." />
          : (
            <div>
              <div className="profile-hero">
                <div className="profile-avatar">{selected?.Gender === 'Female' ? '🐄' : '🐂'}</div>
                <div>
                  <div className="profile-id">#{selected?.CattleID || '—'}</div>
                  <div className="profile-name">{selected?.Name || '—'}</div>
                  <div className="profile-tag">Tag: {selected?.TagNumber}</div>
                  <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ background: 'rgba(255,255,255,0.18)', padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 800 }}>🧬 {selected?.Breed}</span>
                    <span style={{ background: 'rgba(255,255,255,0.18)', padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 800 }}>🎂 {calcAge(selected?.DateOfBirth)}</span>
                    <StatusBadge status={selected?.Status} />
                  </div>
                </div>
              </div>
              {/* Weight History */}
              {profile.weights?.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <h4 style={{ fontFamily: 'Baloo 2,cursive', marginBottom: 10, color: 'var(--green-dark)' }}>⚖️ Weight History</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {profile.weights.slice(0, 5).map((w, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--cream)', padding: '8px 14px', borderRadius: 8, fontWeight: 700 }}>
                        <span>{w.WeightDate}</span><span>{w.WeightKg} kg</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
      </Modal>

      {/* Confirm Delete */}
      <ConfirmModal open={showConfirm}
        message={`Are you sure you want to remove "${selected?.Name || selected?.TagNumber}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirm(false)} />
    </div>
  );
}