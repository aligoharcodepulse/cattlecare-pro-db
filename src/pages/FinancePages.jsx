// ============================================================
//  WeightPage.jsx
// ============================================================
import React, { useEffect, useState } from 'react';
import { addWeight, getAllWeights } from '../api';
import { Modal, Loading, Field, useToast, EmptyState } from '../components/UI';

const MOCK_WEIGHTS = [
  { WeightID: 1,  TagNumber: 'GVF-001', Name: 'Roshni',   WeightDate: '2023-06-15', WeightKg: 392.50 },
  { WeightID: 2,  TagNumber: 'GVF-002', Name: 'Champa',   WeightDate: '2023-06-15', WeightKg: 430.00 },
  { WeightID: 3,  TagNumber: 'GVF-009', Name: 'Sultan',   WeightDate: '2023-07-01', WeightKg: 525.00 },
  { WeightID: 4,  TagNumber: 'GVF-010', Name: 'Bahadur',  WeightDate: '2023-07-01', WeightKg: 500.00 },
  { WeightID: 5,  TagNumber: 'GVF-005', Name: 'Laila',    WeightDate: '2023-03-05', WeightKg: 440.00 },
  { WeightID: 6,  TagNumber: 'GVF-008', Name: 'Sona',     WeightDate: '2023-04-10', WeightKg: 400.00 },
  { WeightID: 7,  TagNumber: 'GVF-017', Name: 'Moti',     WeightDate: '2023-06-01', WeightKg: 120.00 },
];

export function WeightPage() {
  const toast = useToast();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setAdd]     = useState(false);
  const [form, setForm]       = useState({ CattleID: '', WeightDate: '', WeightKg: '' });
  const [saving, setSaving]   = useState(false);

useEffect(() => {
  getAllWeights()
    .then(res => {
      console.log(res.data);
      setRecords(res.data);
    })
    .catch(err => {
      console.error(err);
      setRecords(MOCK_WEIGHTS); 
    })
    .finally(() => setLoading(false));
}, []);

  async function handleAdd() {
    if (!form.CattleID || !form.WeightDate || !form.WeightKg) { toast('Fill all fields', 'error'); return; }
    setSaving(true);
    try {
      await addWeight(form);
      setRecords(p => [...p, { ...form, WeightID: Date.now(), TagNumber: `ID:${form.CattleID}`, Name: `CattleID:${form.CattleID}` }]);
      toast('✅ Weight recorded!');
      setAdd(false); setForm({ CattleID: '', WeightDate: '', WeightKg: '' });
    } catch { toast('Failed', 'error'); }
    finally { setSaving(false); }
  }

  if (loading) return <Loading text="Loading weight records..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h2 className="section-title">⚖️ Weight Records</h2>
        <button className="btn btn-primary" onClick={() => setAdd(true)}>➕ Record Weight</button>
      </div>
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>🏷️ Tag</th><th>📛 Name</th><th>📅 Date</th><th>⚖️ Weight</th><th>📊 Bar</th></tr></thead>
            <tbody>
              {records.map(r => (
                <tr key={r.WeightID}>
                  <td><span style={{ fontFamily: 'monospace', background: 'var(--cream-dark)', padding: '3px 8px', borderRadius: 6, fontWeight: 800 }}>{r.TagNumber}</span></td>
                  <td style={{ fontWeight: 800 }}>{r.Name}</td>
                  <td>{r.WeightDate ? new Date(r.WeightDate).toLocaleDateString('en-PK') : '—'}</td>
                  <td><strong style={{ color: 'var(--green-dark)', fontFamily: 'Baloo 2,cursive', fontSize: 18 }}>{r.WeightKg} kg</strong></td>
                  <td style={{ width: 160 }}>
                    <div style={{ height: 8, background: 'var(--cream-dark)', borderRadius: 999 }}>
                      <div style={{ height: 8, width: `${Math.min((r.WeightKg / 600) * 100, 100)}%`, background: 'var(--green-light)', borderRadius: 999 }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={showAdd} title="Record Weight" icon="⚖️" onClose={() => setAdd(false)}
        footer={<><button className="btn btn-ghost" onClick={() => setAdd(false)}>Cancel</button><button className="btn btn-primary" onClick={handleAdd} disabled={saving}>{saving ? '⏳...' : '✅ Save'}</button></>}>
        <div className="form-grid">
          <Field label="Cattle ID" icon="🐄" required><input className="form-control" type="number" value={form.CattleID} onChange={e => setForm(p => ({ ...p, CattleID: e.target.value }))} placeholder="Enter CattleID" /></Field>
          <Field label="Date" icon="📅" required><input className="form-control" type="date" value={form.WeightDate} onChange={e => setForm(p => ({ ...p, WeightDate: e.target.value }))} /></Field>
          <Field label="Weight (kg)" icon="⚖️" required><input className="form-control" type="number" step="0.5" value={form.WeightKg} onChange={e => setForm(p => ({ ...p, WeightKg: e.target.value }))} placeholder="e.g. 385.5" /></Field>
        </div>
      </Modal>
    </div>
  );
}


// ============================================================
//  PurchasesPage.jsx
// ============================================================
import { getAllPurchases, addPurchase } from '../api';

const MOCK_PURCHASES = [
  { PurchaseID: 1,  TagNumber: 'GVF-001', CattleName: 'Roshni',   SellerName: 'Haji Muhammad Akram',   PurchaseDate: '2021-01-10', PurchasePrice: 85000,  MarketName: 'Mianwali Cattle Market' },
  { PurchaseID: 2,  TagNumber: 'GVF-002', CattleName: 'Champa',   SellerName: 'Chaudhry Liaqat Ali',   PurchaseDate: '2020-07-22', PurchasePrice: 120000, MarketName: 'Sargodha Livestock Mandi' },
  { PurchaseID: 9,  TagNumber: 'GVF-009', CattleName: 'Sultan',   SellerName: 'Sultan Cattle Breeders',PurchaseDate: '2019-04-10', PurchasePrice: 180000, MarketName: 'Faisalabad Livestock' },
  { PurchaseID: 10, TagNumber: 'GVF-010', CattleName: 'Bahadur',  SellerName: 'Mian Nawaz Cattle',     PurchaseDate: '2020-09-25', PurchasePrice: 160000, MarketName: 'Sargodha Livestock Mandi' },
  { PurchaseID: 11, TagNumber: 'GVF-011', CattleName: 'Shehzada', SellerName: 'Arif Brothers Farm',    PurchaseDate: '2021-06-07', PurchasePrice: 145000, MarketName: 'Bhakkar Mandi' },
];

const EMPTY_P = { CattleID: '', UserID: 1, SellerName: '', PurchaseDate: '', PurchasePrice: '', MarketName: '' };

export function PurchasesPage() {
  const toast = useToast();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setAdd]     = useState(false);
  const [form, setForm]       = useState(EMPTY_P);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    getAllPurchases().then(r => setRecords(r.data)).catch(() => setRecords(MOCK_PURCHASES)).finally(() => setLoading(false));
  }, []);

  const totalSpent = records.reduce((sum, r) => sum + (Number(r.PurchasePrice || 0)), 0);

  async function handleAdd() {
    if (!form.CattleID || !form.PurchaseDate || !form.PurchasePrice) { toast('Fill required fields', 'error'); return; }
    setSaving(true);
    try {
      const r = await addPurchase(form);
      setRecords(p => [...p, { ...form, PurchaseID: r.data?.PurchaseID || Date.now(), TagNumber: '—', CattleName: `CattleID:${form.CattleID}` }]);
      toast('✅ Purchase recorded!');
      setAdd(false); setForm(EMPTY_P);
    } catch { toast('Failed', 'error'); }
    finally { setSaving(false); }
  }

  if (loading) return <Loading text="Loading purchases..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="section-title">🛒 Purchase Records</h2>
          <div style={{ fontFamily: 'Baloo 2,cursive', fontSize: 22, color: 'var(--green-dark)' }}>Total Spent: ₨ {totalSpent.toLocaleString()}</div>
        </div>
        <button className="btn btn-primary" onClick={() => setAdd(true)}>➕ Record Purchase</button>
      </div>
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>🐄 Cattle</th><th>🏷️ Tag</th><th>👤 Seller</th><th>📅 Date</th><th>💰 Price</th><th>📍 Market</th></tr></thead>
            <tbody>
              {records.map(r => (
                <tr key={r.PurchaseID}>
                  <td style={{ fontWeight: 800 }}>{r.CattleName}</td>
                  <td><span style={{ fontFamily: 'monospace', background: 'var(--cream-dark)', padding: '3px 8px', borderRadius: 6, fontWeight: 800 }}>{r.TagNumber}</span></td>
                  <td>{r.SellerName || '—'}</td>
                  <td>{r.PurchaseDate ? new Date(r.PurchaseDate).toLocaleDateString('en-PK') : '—'}</td>
                  <td><strong style={{ color: 'var(--green-dark)', fontFamily: 'Baloo 2,cursive', fontSize: 17 }}>₨ {Number(r.PurchasePrice).toLocaleString()}</strong></td>
                  <td>{r.MarketName || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={showAdd} title="Record Purchase" icon="🛒" onClose={() => setAdd(false)}
        footer={<><button className="btn btn-ghost" onClick={() => setAdd(false)}>Cancel</button><button className="btn btn-primary" onClick={handleAdd} disabled={saving}>{saving ? '⏳...' : '✅ Record'}</button></>}>
        <div className="form-grid">
          <Field label="Cattle ID" icon="🐄" required><input className="form-control" type="number" value={form.CattleID} onChange={e => setForm(p => ({ ...p, CattleID: e.target.value }))} placeholder="Enter CattleID" /></Field>
          <Field label="Seller Name" icon="👤"><input className="form-control" value={form.SellerName} onChange={e => setForm(p => ({ ...p, SellerName: e.target.value }))} placeholder="e.g. Haji Muhammad" /></Field>
          <Field label="Purchase Date" icon="📅" required><input className="form-control" type="date" value={form.PurchaseDate} onChange={e => setForm(p => ({ ...p, PurchaseDate: e.target.value }))} /></Field>
          <Field label="Purchase Price (₨)" icon="💰" required><input className="form-control" type="number" value={form.PurchasePrice} onChange={e => setForm(p => ({ ...p, PurchasePrice: e.target.value }))} placeholder="e.g. 85000" /></Field>
          <Field label="Market Name" icon="📍"><input className="form-control" value={form.MarketName} onChange={e => setForm(p => ({ ...p, MarketName: e.target.value }))} placeholder="e.g. Mianwali Mandi" /></Field>
        </div>
      </Modal>
    </div>
  );
}


// ============================================================
//  SalesPage.jsx
// ============================================================
import { getAllSales, addSale } from '../api';

const MOCK_SALES = [
  { SaleID: 1, TagNumber: 'GVF-018', CattleName: 'Jharna',  BuyerName: 'Buyer Rehman',  SaleDate: '2023-01-15', SalePrice: 115000, MarketName: 'Mianwali Cattle Market' },
  { SaleID: 2, TagNumber: 'GVF-019', CattleName: 'Toofan',  BuyerName: 'Buyer Shahzad', SaleDate: '2023-02-20', SalePrice: 130000, MarketName: 'Sargodha Livestock Mandi' },
  { SaleID: 13,TagNumber: 'GVF-001', CattleName: 'Roshni',  BuyerName: 'Buyer Imtiaz',  SaleDate: '2023-09-01', SalePrice: 140000, MarketName: 'Sargodha Livestock Mandi' },
  { SaleID: 14,TagNumber: 'GVF-002', CattleName: 'Champa',  BuyerName: 'Buyer Farhan',  SaleDate: '2023-10-10', SalePrice: 155000, MarketName: 'Bhakkar Mandi' },
  { SaleID: 15,TagNumber: 'GVF-009', CattleName: 'Sultan',  BuyerName: 'Buyer Bilal',   SaleDate: '2023-11-05', SalePrice: 210000, MarketName: 'Lahore Cattle Fair' },
];

const EMPTY_S = { CattleID: '', UserID: 1, BuyerName: '', SaleDate: '', SalePrice: '', MarketName: '' };

export function SalesPage() {
  const toast = useToast();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setAdd]     = useState(false);
  const [form, setForm]       = useState(EMPTY_S);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    getAllSales().then(r => setRecords(r.data)).catch(() => setRecords(MOCK_SALES)).finally(() => setLoading(false));
  }, []);

  const totalEarned = records.reduce((sum, r) => sum + (Number(r.SalePrice || 0)), 0);

  async function handleAdd() {
    if (!form.CattleID || !form.SaleDate || !form.SalePrice) { toast('Fill required fields', 'error'); return; }
    setSaving(true);
    try {
      const r = await addSale(form);
      setRecords(p => [...p, { ...form, SaleID: r.data?.SaleID || Date.now(), TagNumber: '—', CattleName: `CattleID:${form.CattleID}` }]);
      toast('💰 Sale recorded! Profit/Loss auto-calculated.');
      setAdd(false); setForm(EMPTY_S);
    } catch { toast('Failed', 'error'); }
    finally { setSaving(false); }
  }

  if (loading) return <Loading text="Loading sales..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="section-title">💰 Sale Records</h2>
          <div style={{ fontFamily: 'Baloo 2,cursive', fontSize: 22, color: 'var(--green-dark)' }}>Total Earned: ₨ {totalEarned.toLocaleString()}</div>
        </div>
        <button className="btn btn-amber" onClick={() => setAdd(true)}>➕ Record Sale</button>
      </div>
      <div style={{ background: '#fff4e6', border: '2px solid var(--amber)', borderRadius: 'var(--radius-md)', padding: '14px 20px', marginBottom: 20, fontWeight: 700, fontSize: 14, color: '#b05a00' }}>
        💡 Recording a sale will automatically update the cattle's status to "Sold" and calculate Profit/Loss.
      </div>
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>🐄 Cattle</th><th>🏷️ Tag</th><th>👤 Buyer</th><th>📅 Date</th><th>💰 Sale Price</th><th>📍 Market</th></tr></thead>
            <tbody>
              {records.map(r => (
                <tr key={r.SaleID}>
                  <td style={{ fontWeight: 800 }}>{r.CattleName}</td>
                  <td><span style={{ fontFamily: 'monospace', background: 'var(--cream-dark)', padding: '3px 8px', borderRadius: 6, fontWeight: 800 }}>{r.TagNumber}</span></td>
                  <td>{r.BuyerName || '—'}</td>
                  <td>{r.SaleDate ? new Date(r.SaleDate).toLocaleDateString('en-PK') : '—'}</td>
                  <td><strong style={{ color: 'var(--amber-dark)', fontFamily: 'Baloo 2,cursive', fontSize: 17 }}>₨ {Number(r.SalePrice).toLocaleString()}</strong></td>
                  <td>{r.MarketName || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={showAdd} title="Record Sale" icon="💰" onClose={() => setAdd(false)}
        footer={<><button className="btn btn-ghost" onClick={() => setAdd(false)}>Cancel</button><button className="btn btn-amber" onClick={handleAdd} disabled={saving}>{saving ? '⏳...' : '💰 Record'}</button></>}>
        <div className="form-grid">
          <Field label="Cattle ID" icon="🐄" required><input className="form-control" type="number" value={form.CattleID} onChange={e => setForm(p => ({ ...p, CattleID: e.target.value }))} placeholder="Enter CattleID" /></Field>
          <Field label="Buyer Name" icon="👤"><input className="form-control" value={form.BuyerName} onChange={e => setForm(p => ({ ...p, BuyerName: e.target.value }))} placeholder="e.g. Ahmed Khan" /></Field>
          <Field label="Sale Date" icon="📅" required><input className="form-control" type="date" value={form.SaleDate} onChange={e => setForm(p => ({ ...p, SaleDate: e.target.value }))} /></Field>
          <Field label="Sale Price (₨)" icon="💰" required><input className="form-control" type="number" value={form.SalePrice} onChange={e => setForm(p => ({ ...p, SalePrice: e.target.value }))} placeholder="e.g. 150000" /></Field>
          <Field label="Market Name" icon="📍"><input className="form-control" value={form.MarketName} onChange={e => setForm(p => ({ ...p, MarketName: e.target.value }))} placeholder="e.g. Mianwali Mandi" /></Field>
        </div>
      </Modal>
    </div>
  );
}


// ============================================================
//  ProfitLossPage.jsx
// ============================================================
import { getAllProfitLoss } from '../api';

const MOCK_PL = [
  { RecordID: 1,  TagNumber: 'GVF-018', CattleName: 'Jharna',  PurchasePrice: 95000,  SalePrice: 115000, ProfitLoss: 20000,    CalculationDate: '2023-01-15' },
  { RecordID: 2,  TagNumber: 'GVF-019', CattleName: 'Toofan',  PurchasePrice: 110000, SalePrice: 130000, ProfitLoss: 20000,    CalculationDate: '2023-02-20' },
  { RecordID: 13, TagNumber: 'GVF-001', CattleName: 'Roshni',  PurchasePrice: 85000,  SalePrice: 140000, ProfitLoss: 55000,    CalculationDate: '2023-09-01' },
  { RecordID: 14, TagNumber: 'GVF-002', CattleName: 'Champa',  PurchasePrice: 120000, SalePrice: 155000, ProfitLoss: 35000,    CalculationDate: '2023-10-10' },
  { RecordID: 15, TagNumber: 'GVF-009', CattleName: 'Sultan',  PurchasePrice: 180000, SalePrice: 210000, ProfitLoss: 30000,    CalculationDate: '2023-11-05' },
  { RecordID: 16, TagNumber: 'GVF-020', CattleName: 'Badal',   PurchasePrice: 110000, SalePrice: null,   ProfitLoss: -110000,  CalculationDate: '2023-02-14' },
];

export function ProfitLossPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProfitLoss().then(r => setRecords(r.data)).catch(() => setRecords(MOCK_PL)).finally(() => setLoading(false));
  }, []);

  const totalProfit = records.filter(r => Number(r.ProfitLoss) > 0).reduce((s, r) => s + Number(r.ProfitLoss), 0);
  const totalLoss   = records.filter(r => Number(r.ProfitLoss) < 0).reduce((s, r) => s + Number(Math.abs(r.ProfitLoss)), 0);
  const net         = totalProfit - totalLoss;

  if (loading) return <Loading text="Loading profit/loss..." />;

  return (
    <div>
      <h2 className="section-title">📊 Profit & Loss</h2>
      <div style={{ background: 'linear-gradient(135deg, var(--green-dark), var(--green-mid))', borderRadius: 'var(--radius-xl)', padding: '28px 32px', marginBottom: 28, color: 'white' }}>
        <div style={{ fontFamily: 'Baloo 2,cursive', fontSize: 16, opacity: 0.8, marginBottom: 8 }}>NET RESULT</div>
        <div style={{ fontFamily: 'Baloo 2,cursive', fontSize: 48 }}>{net >= 0 ? '📈' : '📉'} ₨ {Math.abs(net).toLocaleString()}</div>
        <div style={{ fontFamily: 'Baloo 2,cursive', fontSize: 18, marginTop: 4, opacity: 0.9 }}>{net >= 0 ? 'Overall Profit' : 'Overall Loss'}</div>
        <div style={{ display: 'flex', gap: 24, marginTop: 20 }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '12px 20px', borderRadius: 12 }}>
            <div style={{ fontSize: 12, opacity: 0.8, fontWeight: 800 }}>TOTAL PROFIT</div>
            <div style={{ fontFamily: 'Baloo 2,cursive', fontSize: 24 }}>₨ {totalProfit.toLocaleString()}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '12px 20px', borderRadius: 12 }}>
            <div style={{ fontSize: 12, opacity: 0.8, fontWeight: 800 }}>TOTAL LOSS</div>
            <div style={{ fontFamily: 'Baloo 2,cursive', fontSize: 24 }}>₨ {totalLoss.toLocaleString()}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '12px 20px', borderRadius: 12 }}>
            <div style={{ fontSize: 12, opacity: 0.8, fontWeight: 800 }}>TRANSACTIONS</div>
            <div style={{ fontFamily: 'Baloo 2,cursive', fontSize: 24 }}>{records.length}</div>
          </div>
        </div>
      </div>
      <div style={{ background: '#fff4e6', border: '2px solid var(--amber)', borderRadius: 'var(--radius-md)', padding: '12px 20px', marginBottom: 20, fontWeight: 700, fontSize: 14 }}>
        💡 Profit/Loss is automatically calculated by the system when a sale is recorded.
      </div>
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>🐄 Cattle</th><th>🏷️ Tag</th><th>🛒 Bought For</th><th>💰 Sold For</th><th>📊 Profit / Loss</th><th>📅 Date</th></tr></thead>
            <tbody>
              {records.map(r => (
                <tr key={r.RecordID}>
                  <td style={{ fontWeight: 800 }}>{r.CattleName}</td>
                  <td><span style={{ fontFamily: 'monospace', background: 'var(--cream-dark)', padding: '3px 8px', borderRadius: 6, fontWeight: 800 }}>{r.TagNumber}</span></td>
                  <td>₨ {r.PurchasePrice?.toLocaleString() || '—'}</td>
                  <td>{r.SalePrice ? `₨ ${r.SalePrice.toLocaleString()}` : <span className="badge badge-grey">No Sale</span>}</td>
                  <td>
                    <span style={{ fontFamily: 'Baloo 2,cursive', fontSize: 18, color: r.ProfitLoss >= 0 ? 'var(--green-dark)' : 'var(--red)', fontWeight: 800 }}>
                      {r.ProfitLoss >= 0 ? '📈 +' : '📉 '}₨ {Math.abs(r.ProfitLoss).toLocaleString()}
                    </span>
                  </td>
                  <td>{r.CalculationDate ? new Date(r.CalculationDate).toLocaleDateString('en-PK') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}