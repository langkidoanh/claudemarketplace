/**
 * SERVICES ROUTES — /api/services
 */

'use strict';

const express = require('express');
const router  = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');

const servicesData = [
  {
    id: 'dao-tao-trien-khai-ai-agents-cho-doanh-nghiep',
    slug: 'dao-tao-trien-khai-ai-agents-cho-doanh-nghiep',
    module: 1,
    name: 'Đào Tạo Triển Khai AI Agents Cho Doanh Nghiệp',
    icon: '🎓',
    shortDesc: 'Đào tạo đội ngũ nội bộ từ cơ bản đến nâng cao để tự vận hành và phát triển AI Agents.',
    targetAudience: ['SMEs muốn tự triển khai AI Agents', 'IT/Tech teams muốn nâng cao kỹ năng AI', 'Product Managers và Business Analysts', 'Entrepreneurs và startup founders'],
    curriculum: {
      basic:    { name: 'Cơ bản',  duration: '2 ngày', topics: ['AI Agent là gì', 'Các use case phổ biến', 'Demo và hands-on', 'Thiết lập agent đầu tiên'], price: 3500000 },
      advanced: { name: 'Nâng cao', duration: '3 ngày', topics: ['Prompt engineering nâng cao', 'Tool use và function calling', 'Multi-agent workflows', 'Testing và optimization'], price: 5500000 },
      master:   { name: 'Master',   duration: '5 ngày', topics: ['Custom agent development', 'Integration với hệ thống doanh nghiệp', 'Production deployment', 'Monitoring và scaling'], price: 9000000 },
    },
    formats: ['Online via Zoom', 'Offline tại TP.HCM & Hà Nội', 'Workshop tại doanh nghiệp (on-site)'],
    upcomingSchedule: [
      { date: '2025-04-15', level: 'basic',    format: 'Online', slots: 20, remaining: 8 },
      { date: '2025-04-22', level: 'advanced',  format: 'Offline - TP.HCM', slots: 15, remaining: 5 },
      { date: '2025-05-10', level: 'master',    format: 'Online', slots: 10, remaining: 7 },
    ],
    postTrainingSupport: '3 tháng hỗ trợ qua Zalo group',
  },
  {
    id: 'tu-van-setup-va-chuyen-giao-bo-ai-agents-cho-doanh-nghiep',
    slug: 'tu-van-setup-va-chuyen-giao-bo-ai-agents-cho-doanh-nghiep',
    module: 2,
    name: 'Tư Vấn, Setup & Chuyển Giao Bộ AI Agents Cho Doanh Nghiệp',
    icon: '🚀',
    shortDesc: 'Chúng tôi làm tất cả: khảo sát, thiết kế, build, test, bàn giao và hỗ trợ vận hành 3 tháng.',
    process: [
      { step: 1, title: 'Khảo sát & Phân tích', desc: 'Workshop 2–4 giờ để hiểu quy trình, pain point và mục tiêu. Output: Problem statement và solution brief.', duration: '1–2 ngày' },
      { step: 2, title: 'Thiết kế Giải pháp',   desc: 'Thiết kế architecture, chọn agents phù hợp, lên roadmap triển khai. Output: Solution design document.', duration: '2–3 ngày' },
      { step: 3, title: 'Build & Cấu hình',     desc: 'Build và configure agents theo spec đã thống nhất. Tích hợp với hệ thống hiện có.', duration: '5–14 ngày' },
      { step: 4, title: 'Test & Validation',    desc: 'UAT với đội ngũ doanh nghiệp, sửa lỗi và tối ưu. Đảm bảo agents hoạt động đúng kỳ vọng.', duration: '3–5 ngày' },
      { step: 5, title: 'Bàn giao & Đào tạo',  desc: 'Bàn giao hệ thống, đào tạo người dùng cuối. Hỗ trợ vận hành 3 tháng đầu.', duration: 'Ongoing 3 tháng' },
    ],
    packages: [
      {
        name: 'Starter',
        desc: 'Phù hợp SMEs 20–50 nhân sự, 1–2 phòng ban',
        price: 'Từ 15.000.000đ',
        agents: '2–3 agents',
        timeline: '2–3 tuần',
        support: '1 tháng hỗ trợ',
        features: ['Khảo sát và tư vấn', '2–3 agents cấu hình sẵn', 'Tích hợp 1 hệ thống', 'Đào tạo 1 buổi', 'Hỗ trợ 1 tháng'],
        popular: false,
      },
      {
        name: 'Growth',
        desc: 'Phù hợp doanh nghiệp 50–200 nhân sự, 3–4 phòng ban',
        price: 'Từ 35.000.000đ',
        agents: '5–8 agents',
        timeline: '4–6 tuần',
        support: '3 tháng hỗ trợ',
        features: ['Tất cả của Starter', '5–8 agents custom', 'Tích hợp đa hệ thống', 'Đào tạo team 3 buổi', 'Hỗ trợ 3 tháng SLA', 'Monthly review meeting'],
        popular: true,
      },
      {
        name: 'Enterprise',
        desc: 'Phù hợp doanh nghiệp 200+ nhân sự, toàn bộ công ty',
        price: 'Liên hệ báo giá',
        agents: 'Không giới hạn',
        timeline: '8–12 tuần',
        support: '12 tháng hỗ trợ',
        features: ['Tất cả của Growth', 'Agents không giới hạn', 'Custom development', 'Dedicated success manager', 'Hỗ trợ 12 tháng 24/7', 'Quarterly business review'],
        popular: false,
      },
    ],
    caseStudies: [
      { company: 'Chuỗi bán lẻ 30 cửa hàng', result: 'Tăng 40% doanh thu sau 3 tháng với Agent Sale + CRM', package: 'Growth' },
      { company: 'Công ty logistics 150 nhân sự', result: 'Giảm 60% thời gian báo cáo vận hành với BI Agent', package: 'Enterprise' },
    ],
  },
];

/* ─── GET /api/services — All services ──────────────────────── */
router.get('/', asyncHandler(async (req, res) => {
  res.json({ success: true, data: servicesData });
}));

/* ─── GET /api/services/:slug — Single service ───────────────── */
router.get('/:slug', asyncHandler(async (req, res) => {
  const service = servicesData.find(s => s.slug === req.params.slug);

  if (!service) {
    res.status(404);
    throw new Error(`Không tìm thấy dịch vụ: ${req.params.slug}`);
  }

  res.json({ success: true, data: service });
}));

/* ─── POST /api/services/consultation — Request consultation ─── */
router.post('/consultation', asyncHandler(async (req, res) => {
  const { name, company, email, phone, employees, package: pkg, message } = req.body;

  if (!name || !email || !company) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng điền đầy đủ thông tin bắt buộc.',
    });
  }

  console.log(`💼 Consultation request: ${company} — Package: ${pkg || 'TBD'} — ${employees} nhân sự`);

  res.json({
    success: true,
    message: 'Đăng ký tư vấn miễn phí thành công! Chuyên gia sẽ liên hệ bạn trong 4 giờ làm việc.',
    nextStep: 'Kiểm tra email để nhận lịch tư vấn chi tiết.',
  });
}));

/* ─── POST /api/services/training-register — Register training ─ */
router.post('/training-register', asyncHandler(async (req, res) => {
  const { name, company, email, phone, level, date } = req.body;

  if (!name || !email || !level) {
    return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin.' });
  }

  console.log(`🎓 Training registration: ${name} — Level: ${level} — Date: ${date}`);

  res.json({
    success: true,
    message: `Đăng ký khóa ${level} thành công! Thông tin xác nhận sẽ được gửi tới ${email}.`,
    invoiceNote: 'Hóa đơn và tài liệu chuẩn bị sẽ được gửi 3 ngày trước khai giảng.',
  });
}));

module.exports = router;
