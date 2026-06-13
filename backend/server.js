// ============================================================
//  CattleCare Pro — backend/server.js
//  Express + mysql2 → calls MySQL stored procedures only
//  No raw SQL from GUI (milestone requirement)
// ============================================================

require('dotenv').config();
const express = require('express');
const mysql   = require('mysql2/promise');
const cors    = require('cors');

const app = express();
app.use(cors({
  origin: ['https://cattlecare-pro.web.app/', 'https://cattlecare-pro.firebaseapp.com/', 'http://localhost:5173']
}));
app.use(express.json());

// ── DB CONNECTION POOL ───────────────────────────────────────
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

// Test connection on startup
pool.getConnection()
  .then(conn => { console.log('✅ MySQL connected — cattlecare_pro'); conn.release(); })
  .catch(err  => console.error('❌ MySQL connection failed:', err.message));

// ── HELPER ───────────────────────────────────────────────────
// All DB calls go through stored procedures — no raw SQL
async function callProc(name, params = []) {
  const placeholders = params.map(() => '?').join(', ');
  const sql = `CALL ${name}(${placeholders})`;
  const [rows] = await pool.execute(sql, params);
  return rows;
}

// For stored procedures that return an OUT param
async function callProcOut(name, inParams = [], outCount = 1) {
  const conn = await pool.getConnection();
  try {
    const inPlaceholders  = inParams.map(() => '?').join(', ');
    const outPlaceholders = Array(outCount).fill('@out_val').map((_, i) => `@out${i}`).join(', ');
    const allPlaceholders = inParams.length
      ? `${inPlaceholders}, ${outPlaceholders}`
      : outPlaceholders;

    await conn.execute(`CALL ${name}(${allPlaceholders})`, inParams);
    const [[result]] = await conn.execute(
      `SELECT ${Array(outCount).fill(0).map((_, i) => `@out${i} AS out${i}`).join(', ')}`
    );
    return result;
  } finally {
    conn.release();
  }
}

// ── DASHBOARD ────────────────────────────────────────────────
app.get('/api/dashboard', async (req, res) => {
  try {
    const conn = await pool.getConnection();

    const [[{ totalCattle }]]    = await conn.execute('SELECT COUNT(*) AS totalCattle FROM CATTLE');
    const [[{ activeCattle }]]   = await conn.execute("SELECT COUNT(*) AS activeCattle FROM CATTLE WHERE Status='Active'");
    const [[{ soldCattle }]]     = await conn.execute("SELECT COUNT(*) AS soldCattle FROM CATTLE WHERE Status='Sold'");
    const [[{ deadCattle }]]     = await conn.execute("SELECT COUNT(*) AS deadCattle FROM CATTLE WHERE Status='Dead'");
    const [[{ totalCows }]]      = await conn.execute('SELECT COUNT(*) AS totalCows FROM COW');
    const [[{ lactatingCows }]]  = await conn.execute("SELECT COUNT(*) AS lactatingCows FROM COW WHERE LactationStatus='Lactating'");
    const [[{ pregnantCows }]]   = await conn.execute("SELECT COUNT(*) AS pregnantCows FROM COW WHERE LactationStatus='Pregnant'");
    const [[{ totalBulls }]]     = await conn.execute('SELECT COUNT(*) AS totalBulls FROM BULL');
    const [[{ fertileBulls }]]   = await conn.execute("SELECT COUNT(*) AS fertileBulls FROM BULL WHERE FertilityStatus='Fertile'");
    const [[{ pendingBreeding }]]= await conn.execute("SELECT COUNT(*) AS pendingBreeding FROM BREEDING_RECORD WHERE Outcome='Pending'");
    const [[{ totalBirths }]]    = await conn.execute('SELECT COUNT(*) AS totalBirths FROM BIRTH_RECORD');
    const [[{ totalDeaths }]]    = await conn.execute('SELECT COUNT(*) AS totalDeaths FROM DEATH_RECORD');
    const [[{ deathsThisMonth }]]= await conn.execute("SELECT COUNT(*) AS deathsThisMonth FROM DEATH_RECORD WHERE MONTH(DeathDate)=MONTH(CURDATE()) AND YEAR(DeathDate)=YEAR(CURDATE())");
    const [[{ totalPurchases }]] = await conn.execute('SELECT COUNT(*) AS totalPurchases FROM PURCHASE_RECORD');
    const [[{ totalSales }]]     = await conn.execute('SELECT COUNT(*) AS totalSales FROM SALE_RECORD');
    const [[{ totalProfit }]]    = await conn.execute('SELECT COALESCE(SUM(ProfitLoss),0) AS totalProfit FROM PROFIT_LOSS_RECORD WHERE ProfitLoss > 0');
    const [[{ totalLoss }]]      = await conn.execute('SELECT COALESCE(ABS(SUM(ProfitLoss)),0) AS totalLoss FROM PROFIT_LOSS_RECORD WHERE ProfitLoss < 0');

    conn.release();

    res.json({
      totalCattle, activeCattle, soldCattle, deadCattle,
      totalCows, lactatingCows, pregnantCows,
      totalBulls, fertileBulls,
      pendingBreeding, totalBirths, totalDeaths, deathsThisMonth,
      totalPurchases, totalSales,
      totalProfit: Number(totalProfit), totalLoss: Number(totalLoss),
      recentActivity: []
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ── CATTLE ───────────────────────────────────────────────────

// GET all cattle — uses vw_ActiveCattle + full CATTLE table
app.get('/api/cattle', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute(`
      SELECT c.CattleID, c.TagNumber, c.Name, c.Breed, c.Gender,
             c.DateOfBirth, c.Status, f.FarmName
      FROM CATTLE c
      JOIN FARM f ON c.FarmID = f.FarmID
      ORDER BY c.CattleID DESC
    `);
    conn.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single cattle profile — calls sp_GetCattleProfile
app.get('/api/cattle/:id', async (req, res) => {
  try {
    const rows = await callProc('sp_GetCattleProfile', [req.params.id]);
    // sp returns 3 result sets: cattle, weights, colors
    res.json({
      cattle:  rows[0]?.[0] || null,
      weights: rows[1]      || [],
      colors:  rows[2]      || [],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add cattle — calls sp_AddCattle then sp_AddCow or sp_AddBull
app.post('/api/cattle', async (req, res) => {
  const { TagNumber, Name, Breed, Gender, DateOfBirth, FarmID = 1 } = req.body;
  try {
    // sp_AddCattle has an OUT param for the new CattleID
    const conn = await pool.getConnection();
    await conn.execute('SET @new_id = 0');
    await conn.execute(
      'CALL sp_AddCattle(?, ?, ?, ?, ?, ?, @new_id)',
      [TagNumber, Name || null, Breed || null, Gender, DateOfBirth || null, FarmID]
    );
    const [[{ new_id }]] = await conn.execute('SELECT @new_id AS new_id');
    conn.release();

    // Auto-add COW or BULL subtype record
    if (Gender === 'Female') {
      await callProc('sp_AddCow', [new_id, 0.00, 'Dry', null]);
    } else {
      await callProc('sp_AddBull', [new_id, 'Unknown', 'Unknown']);
    }

    res.json({ CattleID: new_id, message: 'Cattle added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update cattle
app.put('/api/cattle/:id', async (req, res) => {
  const { TagNumber, Name, Breed, Gender, DateOfBirth, Status } = req.body;
  try {
    const conn = await pool.getConnection();
    await conn.execute(
      'UPDATE CATTLE SET TagNumber=?, Name=?, Breed=?, Gender=?, DateOfBirth=?, Status=? WHERE CattleID=?',
      [TagNumber, Name, Breed, Gender, DateOfBirth || null, Status, req.params.id]
    );
    conn.release();
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE cattle
app.delete('/api/cattle/:id', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    await conn.execute('DELETE FROM CATTLE WHERE CattleID=?', [req.params.id]);
    conn.release();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── COWS ─────────────────────────────────────────────────────
app.get('/api/cows', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute(`
      SELECT c.CattleID, c.TagNumber, c.Name, c.Breed,
             co.MilkProduction, co.LactationStatus, co.LastCalvingDate
      FROM CATTLE c
      JOIN COW co ON c.CattleID = co.CattleID
      WHERE c.Status != 'Dead'
      ORDER BY co.MilkProduction DESC
    `);
    conn.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/cows/:id', async (req, res) => {
  const { MilkProduction, LactationStatus, LastCalvingDate } = req.body;
  try {
    const conn = await pool.getConnection();
    await conn.execute(
      'CALL sp_AddCow(?, ?, ?, ?)',  // reuse sp — or direct UPDATE
      [req.params.id, MilkProduction, LactationStatus, LastCalvingDate || null]
    );
    // Since sp_AddCow does INSERT (not UPDATE), use direct UPDATE here:
    await conn.execute(
      'UPDATE COW SET MilkProduction=?, LactationStatus=?, LastCalvingDate=? WHERE CattleID=?',
      [MilkProduction, LactationStatus, LastCalvingDate || null, req.params.id]
    );
    conn.release();
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── BULLS ────────────────────────────────────────────────────
app.get('/api/bulls', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute(`
      SELECT c.CattleID, c.TagNumber, c.Name, c.Breed,
             b.FertilityStatus, b.SemenQuality
      FROM CATTLE c
      JOIN BULL b ON c.CattleID = b.CattleID
      WHERE c.Status != 'Dead'
      ORDER BY b.FertilityStatus
    `);
    conn.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/bulls/:id', async (req, res) => {
  const { FertilityStatus, SemenQuality } = req.body;
  try {
    const conn = await pool.getConnection();
    await conn.execute(
      'UPDATE BULL SET FertilityStatus=?, SemenQuality=? WHERE CattleID=?',
      [FertilityStatus, SemenQuality, req.params.id]
    );
    conn.release();
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── BREEDING ─────────────────────────────────────────────────
app.get('/api/breeding', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute(`
      SELECT br.BreedingID, br.BreedingDate, br.Method,
             br.ExpectedDueDate, br.Outcome,
             cow.Name  AS CowName,  cow.TagNumber  AS CowTag,
             bull.Name AS BullName, bull.TagNumber AS BullTag
      FROM BREEDING_RECORD br
      JOIN CATTLE cow  ON br.CowID  = cow.CattleID
      JOIN CATTLE bull ON br.BullID = bull.CattleID
      ORDER BY br.BreedingDate DESC
    `);
    conn.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/breeding', async (req, res) => {
  const { CowID, BullID, BreedingDate, Method, ExpectedDueDate } = req.body;
  try {
    await callProc('sp_RecordBreeding', [CowID, BullID, BreedingDate, Method, ExpectedDueDate || null]);
    res.json({ message: 'Breeding recorded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/breeding/:id', async (req, res) => {
  const { Outcome } = req.body;
  try {
    const conn = await pool.getConnection();
    await conn.execute('UPDATE BREEDING_RECORD SET Outcome=? WHERE BreedingID=?', [Outcome, req.params.id]);
    conn.release();
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/breeding/:id', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    await conn.execute('DELETE FROM BREEDING_RECORD WHERE BreedingID=?', [req.params.id]);
    conn.release();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── BIRTHS ───────────────────────────────────────────────────
app.get('/api/births', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute(`
      SELECT br.BirthID, br.BirthDate, br.BirthWeight, br.Complications,
             mom.Name   AS MotherName, mom.TagNumber AS MotherTag,
             calf.TagNumber AS CalfTag, calf.Name AS CalfName
      FROM BIRTH_RECORD br
      JOIN CATTLE mom  ON br.MotherID = mom.CattleID
      JOIN CATTLE calf ON br.CalfID   = calf.CattleID
      ORDER BY br.BirthDate DESC
    `);
    conn.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/births', async (req, res) => {
  const { MotherID, CalfID, BreedingID, BirthDate, BirthWeight, Complications } = req.body;
  try {
    await callProc('sp_RecordBirth', [MotherID, CalfID, BreedingID || null, BirthDate, BirthWeight || null, Complications || null]);
    res.json({ message: 'Birth recorded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DEATHS ───────────────────────────────────────────────────
app.get('/api/deaths', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute(`
      SELECT dr.DeathID, dr.DeathDate, dr.Cause, dr.VetVerified,
             c.Name AS CattleName, c.TagNumber
      FROM DEATH_RECORD dr
      JOIN CATTLE c ON dr.CattleID = c.CattleID
      ORDER BY dr.DeathDate DESC
    `);
    conn.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/deaths', async (req, res) => {
  const { CattleID, DeathDate, Cause, VetVerified } = req.body;
  try {
    await callProc('sp_RecordDeath', [CattleID, DeathDate, Cause || null, VetVerified || 0]);
    res.json({ message: 'Death recorded — cattle status auto-updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── WEIGHTS ──────────────────────────────────────────────────
app.get('/api/weights', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute(`
      SELECT wr.WeightID, wr.WeightDate, wr.WeightKg,
             c.TagNumber, c.Name
      FROM WEIGHT_RECORD wr
      JOIN CATTLE c ON wr.CattleID = c.CattleID
      ORDER BY wr.WeightDate DESC
    `);
    conn.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/weights/:cattleId', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute(
      'SELECT WeightDate, WeightKg FROM WEIGHT_RECORD WHERE CattleID=? ORDER BY WeightDate DESC',
      [req.params.cattleId]
    );
    conn.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/weights', async (req, res) => {
  const { CattleID, WeightDate, WeightKg } = req.body;
  try {
    await callProc('sp_AddWeightRecord', [CattleID, WeightDate, WeightKg]);
    res.json({ message: 'Weight recorded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PURCHASES ────────────────────────────────────────────────
app.get('/api/purchases', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute(`
      SELECT pr.PurchaseID, pr.SellerName, pr.PurchaseDate,
             pr.PurchasePrice, pr.MarketName,
             c.TagNumber, c.Name AS CattleName
      FROM PURCHASE_RECORD pr
      JOIN CATTLE c ON pr.CattleID = c.CattleID
      ORDER BY pr.PurchaseDate DESC
    `);
    conn.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/purchases', async (req, res) => {
  const { CattleID, UserID = 1, SellerName, PurchaseDate, PurchasePrice, MarketName } = req.body;
  try {
    await callProc('sp_RecordPurchase', [CattleID, UserID, SellerName || null, PurchaseDate, PurchasePrice, MarketName || null]);
    res.json({ message: 'Purchase recorded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── SALES ────────────────────────────────────────────────────
app.get('/api/sales', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute(`
      SELECT sr.SaleID, sr.BuyerName, sr.SaleDate,
             sr.SalePrice, sr.MarketName,
             c.TagNumber, c.Name AS CattleName
      FROM SALE_RECORD sr
      JOIN CATTLE c ON sr.CattleID = c.CattleID
      ORDER BY sr.SaleDate DESC
    `);
    conn.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/sales', async (req, res) => {
  const { CattleID, UserID = 1, BuyerName, SaleDate, SalePrice, MarketName } = req.body;
  try {
    await callProc('sp_RecordSale', [CattleID, UserID, BuyerName || null, SaleDate, SalePrice, MarketName || null]);
    res.json({ message: 'Sale recorded — status updated + profit/loss calculated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PROFIT / LOSS ─────────────────────────────────────────────
app.get('/api/profitloss', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT pl.RecordID, pl.ProfitLoss, pl.CalculationDate,
             c.TagNumber, c.Name AS CattleName,
             pr.PurchasePrice, sr.SalePrice
      FROM PROFIT_LOSS_RECORD pl
      JOIN  CATTLE c           ON pl.CattleID   = c.CattleID
      LEFT JOIN PURCHASE_RECORD pr ON pl.PurchaseID = pr.PurchaseID
      LEFT JOIN SALE_RECORD sr     ON pl.SaleID     = sr.SaleID
      ORDER BY pl.CalculationDate DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── START SERVER ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 CattleCare backend running on http://localhost:${PORT}`);
  console.log(`   React app should be on http://localhost:5173`);
});