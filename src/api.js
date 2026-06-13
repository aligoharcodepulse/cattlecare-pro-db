// ============================================================
//  api.js  —  All backend calls go through stored procedures
//  Base URL points to Express backend (see backend/server.js)
// ============================================================
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// ── CATTLE ──────────────────────────────────────────────────
export const getAllCattle      = ()       => API.get('/cattle');
export const getCattleProfile  = (id)     => API.get(`/cattle/${id}`);
export const addCattle         = (data)   => API.post('/cattle', data);
export const updateCattle      = (id, d)  => API.put(`/cattle/${id}`, d);
export const deleteCattle      = (id)     => API.delete(`/cattle/${id}`);

// ── COW ─────────────────────────────────────────────────────
export const getAllCows        = ()       => API.get('/cows');
export const updateCow         = (id, d)  => API.put(`/cows/${id}`, d);

// ── BULL ────────────────────────────────────────────────────
export const getAllBulls       = ()       => API.get('/bulls');
export const updateBull        = (id, d)  => API.put(`/bulls/${id}`, d);

// ── BREEDING ────────────────────────────────────────────────
export const getAllBreeding    = ()       => API.get('/breeding');
export const addBreeding       = (data)   => API.post('/breeding', data);
export const updateBreeding    = (id, d)  => API.put(`/breeding/${id}`, d);
export const deleteBreeding    = (id)     => API.delete(`/breeding/${id}`);

// ── BIRTH ───────────────────────────────────────────────────
export const getAllBirths      = ()       => API.get('/births');
export const addBirth          = (data)   => API.post('/births', data);

// ── DEATH ───────────────────────────────────────────────────
export const getAllDeaths      = ()       => API.get('/deaths');
export const addDeath          = (data)   => API.post('/deaths', data);

// ── WEIGHT ──────────────────────────────────────────────────
export const getAllWeights     = ()       => API.get('/weights');
export const getWeightByCattle = (id)     => API.get(`/weights/${id}`);
export const addWeight         = (data)   => API.post('/weights', data);

// ── PURCHASE ────────────────────────────────────────────────
export const getAllPurchases   = ()       => API.get('/purchases');
export const addPurchase       = (data)   => API.post('/purchases', data);

// ── SALE ────────────────────────────────────────────────────
export const getAllSales       = ()       => API.get('/sales');
export const addSale           = (data)   => API.post('/sales', data);

// ── PROFIT/LOSS ─────────────────────────────────────────────
export const getAllProfitLoss  = ()       => API.get('/profitloss');

// ── DASHBOARD ───────────────────────────────────────────────
export const getDashboardStats = ()       => API.get('/dashboard');