/**
 * AGENTS ROUTES — /api/agents
 */

'use strict';

const express = require('express');
const router  = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const agentsData = require('../data/agents.json');

/* ─── GET /api/agents — List all agents ────────────────────── */
router.get('/', asyncHandler(async (req, res) => {
  const {
    dept,
    status,
    sort    = 'popular',
    page    = 1,
    limit   = 12,
    q,
  } = req.query;

  let agents = [...agentsData];

  // Filter by department
  if (dept && dept !== 'all') {
    agents = agents.filter(a => a.department === dept);
  }

  // Filter by status
  if (status && status !== 'all') {
    agents = agents.filter(a => a.status === status);
  }

  // Search
  if (q) {
    const query = q.toLowerCase();
    agents = agents.filter(a =>
      a.name.toLowerCase().includes(query) ||
      a.shortDesc.toLowerCase().includes(query) ||
      a.tags.some(t => t.toLowerCase().includes(query)) ||
      a.departmentLabel.toLowerCase().includes(query)
    );
  }

  // Sort
  const sortFns = {
    popular:    (a, b) => b.totalUsers - a.totalUsers,
    rating:     (a, b) => (b.rating || 0) - (a.rating || 0),
    newest:     (a, b) => new Date(b.launchDate || 0) - new Date(a.launchDate || 0),
    'price-asc':(a, b) => a.price - b.price,
    'price-desc':(a, b) => b.price - a.price,
  };
  if (sortFns[sort]) agents.sort(sortFns[sort]);

  // Pagination
  const pageNum  = parseInt(page);
  const limitNum = parseInt(limit);
  const total    = agents.length;
  const start    = (pageNum - 1) * limitNum;
  const paginated = agents.slice(start, start + limitNum);

  res.json({
    success: true,
    data: paginated,
    pagination: {
      total,
      page:       pageNum,
      limit:      limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
    filters: { dept, status, sort, q },
  });
}));

/* ─── GET /api/agents/stats — Marketplace stats ─────────────── */
router.get('/stats', asyncHandler(async (req, res) => {
  const live     = agentsData.filter(a => a.status === 'live').length;
  const preorder = agentsData.filter(a => a.status === 'preorder').length;
  const totalUsers = agentsData.reduce((sum, a) => sum + (a.totalUsers || 0), 0);
  const avgRating  = agentsData
    .filter(a => a.rating)
    .reduce((sum, a, _, arr) => sum + a.rating / arr.length, 0);

  const departments = {};
  agentsData.forEach(a => {
    if (!departments[a.department]) {
      departments[a.department] = { label: a.departmentLabel, count: 0 };
    }
    departments[a.department].count++;
  });

  res.json({
    success: true,
    data: {
      totalAgents:    agentsData.length,
      liveAgents:     live,
      preorderAgents: preorder,
      totalUsers,
      avgRating:      Math.round(avgRating * 10) / 10,
      departments,
    },
  });
}));

/* ─── GET /api/agents/featured — Featured agents ────────────── */
router.get('/featured', asyncHandler(async (req, res) => {
  const featured = agentsData
    .filter(a => a.status === 'live')
    .sort((a, b) => b.totalUsers - a.totalUsers)
    .slice(0, 4);

  res.json({ success: true, data: featured });
}));

/* ─── GET /api/agents/:slug — Single agent detail ───────────── */
router.get('/:slug', asyncHandler(async (req, res) => {
  const agent = agentsData.find(a => a.slug === req.params.slug);

  if (!agent) {
    res.status(404);
    throw new Error(`Không tìm thấy agent: ${req.params.slug}`);
  }

  // Get related agents
  const related = agent.relatedAgents
    .map(slug => agentsData.find(a => a.slug === slug))
    .filter(Boolean)
    .slice(0, 3);

  res.json({
    success: true,
    data: { ...agent, relatedAgentsData: related },
  });
}));

/* ─── POST /api/agents/:slug/preorder — Pre-order agent ─────── */
router.post('/:slug/preorder', asyncHandler(async (req, res) => {
  const agent = agentsData.find(a => a.slug === req.params.slug);

  if (!agent) {
    res.status(404);
    throw new Error('Không tìm thấy agent.');
  }

  if (agent.status !== 'preorder') {
    return res.status(400).json({
      success: false,
      message: 'Agent này đã ra mắt rồi. Vui lòng mua trực tiếp.',
    });
  }

  const { email, companyName, phone } = req.body;

  if (!email || !companyName) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp email và tên doanh nghiệp.',
    });
  }

  // TODO: Save to database + send confirmation email
  console.log(`📦 Pre-order: ${agent.name} — ${companyName} (${email})`);

  res.json({
    success: true,
    message: `Đặt hàng trước thành công! Chúng tôi sẽ liên hệ với ${email} khi agent ra mắt.`,
    data: {
      agentName:     agent.name,
      expectedDate:  agent.expectedDate,
      preorderPrice: agent.preorderPrice,
      discount:      '20%',
    },
  });
}));

/* ─── POST /api/agents/:slug/wishlist — Add to wishlist ─────── */
router.post('/:slug/wishlist', asyncHandler(async (req, res) => {
  const agent = agentsData.find(a => a.slug === req.params.slug);

  if (!agent) {
    res.status(404);
    throw new Error('Không tìm thấy agent.');
  }

  // TODO: Save to user's wishlist in database
  res.json({
    success: true,
    message: `Đã thêm "${agent.name}" vào danh sách yêu thích.`,
  });
}));

/* ─── POST /api/agents/:slug/trial — Request free trial ─────── */
router.post('/:slug/trial', asyncHandler(async (req, res) => {
  const agent = agentsData.find(a => a.slug === req.params.slug);

  if (!agent || agent.status !== 'live') {
    return res.status(400).json({ success: false, message: 'Agent không khả dụng cho dùng thử.' });
  }

  const { email, companyName, phone } = req.body;
  if (!email || !companyName) {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp email và tên doanh nghiệp.' });
  }

  // TODO: Create trial account + send onboarding email
  console.log(`🎯 Trial request: ${agent.name} — ${companyName} (${email})`);

  res.json({
    success: true,
    message: `Yêu cầu dùng thử 7 ngày thành công! Đội ngũ sẽ liên hệ ${email} trong 24h để setup.`,
    trialDays: 7,
  });
}));

module.exports = router;
