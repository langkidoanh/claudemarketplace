/**
 * CLAUDEMARKETPLACE.VN — Express API Server
 * Main entry point
 */

'use strict';

require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const compression = require('compression');
const rateLimit  = require('express-rate-limit');
const path       = require('path');

const agentRoutes   = require('./routes/agents');
const newsRoutes    = require('./routes/news');
const serviceRoutes = require('./routes/services');
const contactRoutes = require('./routes/contact');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 5000;

/* ─── SECURITY MIDDLEWARE ────────────────────────────────────── */
app.use(helmet({
  contentSecurityPolicy: false, // configure separately for production
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

/* ─── RATE LIMITING ──────────────────────────────────────────── */
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
  max:      parseInt(process.env.RATE_LIMIT_MAX)        || 100,
  message:  { success: false, message: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.' },
  standardHeaders: true,
  legacyHeaders:   false,
});

const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { success: false, message: 'Đã gửi quá nhiều tin nhắn. Vui lòng thử lại sau 1 giờ.' },
});

app.use('/api', limiter);
app.use('/api/contact', strictLimiter);

/* ─── GENERAL MIDDLEWARE ─────────────────────────────────────── */
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* ─── STATIC FILES (Frontend) ───────────────────────────────── */
app.use(express.static(path.join(__dirname, '../frontend'), {
  maxAge: process.env.NODE_ENV === 'production' ? '7d' : '0',
  etag: true,
}));

/* ─── HEALTH CHECK ───────────────────────────────────────────── */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Claude Marketplace API is running 🚀',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

/* ─── API ROUTES ─────────────────────────────────────────────── */
app.use('/api/agents',   agentRoutes);
app.use('/api/news',     newsRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/contact',  contactRoutes);

/* ─── NEWSLETTER ENDPOINT ────────────────────────────────────── */
app.post('/api/newsletter/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Email không hợp lệ.' });
  }

  // TODO: integrate with email service (Mailchimp, SendGrid, etc.)
  console.log(`📧 New newsletter subscriber: ${email}`);

  res.json({
    success: true,
    message: 'Đăng ký nhận tin thành công! Cảm ơn bạn.',
  });
});

/* ─── SPA FALLBACK (serve index.html for all frontend routes) ── */
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API endpoint không tồn tại.' });
  }
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

/* ─── ERROR HANDLERS ─────────────────────────────────────────── */
app.use(notFound);
app.use(errorHandler);

/* ─── START SERVER ───────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`\n🚀 Claude Marketplace API running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`📡 API Base: http://localhost:${PORT}/api\n`);
});

module.exports = app;
