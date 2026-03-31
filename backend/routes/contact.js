/**
 * CONTACT ROUTES — /api/contact
 */

'use strict';

const express = require('express');
const router  = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');

/* ─── POST /api/contact — Submit contact form ───────────────── */
router.post('/', asyncHandler(async (req, res) => {
  const {
    name, company, email, phone,
    department, message, service,
  } = req.body;

  // Validation
  const errors = [];
  if (!name?.trim())    errors.push('Vui lòng nhập họ tên.');
  if (!email?.trim())   errors.push('Vui lòng nhập email.');
  if (!message?.trim()) errors.push('Vui lòng nhập nội dung.');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Email không hợp lệ.');
  }

  if (errors.length) {
    return res.status(400).json({ success: false, errors });
  }

  // TODO: Save to database
  // TODO: Send notification email
  // TODO: Send auto-reply to customer

  console.log(`📩 New contact form:`, {
    name, company, email, phone, department, service,
    message: message.substring(0, 100) + '...',
  });

  res.json({
    success: true,
    message: 'Cảm ơn bạn đã liên hệ! Đội ngũ sẽ phản hồi trong vòng 24 giờ làm việc.',
  });
}));

/* ─── POST /api/contact/demo — Request demo call ────────────── */
router.post('/demo', asyncHandler(async (req, res) => {
  const { name, company, email, phone, preferredTime } = req.body;

  if (!name || !email || !company) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng điền đầy đủ thông tin.',
    });
  }

  // TODO: Create Calendly event or send calendar invite
  console.log(`📅 Demo request: ${company} — ${email} — Preferred: ${preferredTime}`);

  res.json({
    success: true,
    message: 'Đặt lịch demo thành công! Đội ngũ sẽ xác nhận lịch qua email trong 2 giờ làm việc.',
    estimatedResponse: '2 giờ làm việc',
  });
}));

/* ─── POST /api/contact/consultation — Free consultation ─────── */
router.post('/consultation', asyncHandler(async (req, res) => {
  const { name, company, email, phone, employees, needs } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp tên và email.',
    });
  }

  console.log(`💼 Consultation request: ${company} (${employees} nhân sự) — Needs: ${needs}`);

  res.json({
    success: true,
    message: 'Đăng ký tư vấn miễn phí thành công! Chuyên gia sẽ liên hệ ${email} trong 4 giờ làm việc.',
  });
}));

module.exports = router;
