/**
 * NEWS ROUTES — /api/news
 */

'use strict';

const express = require('express');
const router  = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');

// Static news data (replace with DB in production)
const newsData = [
  {
    id: 'claude-3-5-sonnet-cap-nhat-moi-nhat-anh-huong-ai-agents',
    slug: 'claude-3-5-sonnet-cap-nhat-moi-nhat-anh-huong-ai-agents',
    category: 'tin-tuc-claude-updates',
    categoryLabel: 'Tin Tức Claude Updates',
    title: 'Claude 3.5 Sonnet Cập Nhật Gì Mới Nhất Và Ảnh Hưởng Đến AI Agents Ra Sao',
    excerpt: 'Anthropic vừa ra mắt Claude 3.5 Sonnet với nhiều cải tiến đột phá về reasoning và tool use. Phân tích tác động thực tế đến các AI Agents đang hoạt động trên marketplace.',
    author: { name: 'Anh Tuấn', role: 'AI Researcher', initials: 'AT' },
    publishedAt: '2025-03-15',
    readTime: 5,
    featured: true,
    relatedAgents: ['agent-tu-van-chot-sale-24-7', 'agent-phan-tich-ket-qua-kinh-doanh-tu-dong'],
    tags: ['Claude 3.5', 'Anthropic', 'update', 'AI agents', 'reasoning'],
    views: 2840,
  },
  {
    id: 'tang-40-doanh-thu-nho-agent-sale-ai',
    slug: 'tang-40-doanh-thu-nho-agent-sale-ai',
    category: 'tin-tuc-case-study-doanh-nghiep',
    categoryLabel: 'Tin Tức Case Study Doanh Nghiệp',
    title: 'Case Study: Doanh Nghiệp Bán Lẻ Tăng 40% Doanh Thu Nhờ Agent Sale AI',
    excerpt: 'Chuỗi bán lẻ 30 cửa hàng tại TP.HCM đã tăng 40% doanh thu trong 3 tháng sau khi triển khai Agent Sale 24/7. Chi tiết case study và bài học rút ra.',
    author: { name: 'Minh Hiếu', role: 'Business Analyst', initials: 'MH' },
    publishedAt: '2025-03-10',
    readTime: 8,
    featured: false,
    relatedAgents: ['agent-tu-van-chot-sale-24-7', 'agent-crm-tu-dong-hoa-quy-trinh-khach-hang'],
    tags: ['case study', 'sale', 'bán lẻ', 'doanh thu', 'ROI'],
    views: 3210,
  },
  {
    id: 'ai-agent-la-gi-giai-thich-toan-dien-cho-doanh-nghiep-viet-nam',
    slug: 'ai-agent-la-gi-giai-thich-toan-dien-cho-doanh-nghiep-viet-nam',
    category: 'tin-tuc-ai-agents',
    categoryLabel: 'Tin Tức AI Agents',
    title: 'AI Agent Là Gì? Giải Thích Toàn Diện Cho Doanh Nghiệp Việt Nam',
    excerpt: 'AI Agent là gì và khác chatbot thông thường như thế nào? Tại sao năm 2025 là thời điểm doanh nghiệp Việt Nam cần bắt đầu với AI Agents ngay.',
    author: { name: 'Thu Lan', role: 'Content Lead', initials: 'TL' },
    publishedAt: '2025-03-05',
    readTime: 6,
    featured: false,
    relatedAgents: ['agent-cskh-thong-minh-24-7', 'agent-viet-content-seo-tu-dong'],
    tags: ['AI agent là gì', 'chatbot', 'automation', 'doanh nghiệp', 'cơ bản'],
    views: 5640,
  },
  {
    id: 'tich-hop-ai-agent-vao-quy-trinh-sale-tu-a-den-z',
    slug: 'tich-hop-ai-agent-vao-quy-trinh-sale-tu-a-den-z',
    category: 'tin-tuc-huong-dan-trien-khai-ai-agents',
    categoryLabel: 'Tin Tức Hướng Dẫn Triển Khai AI Agents',
    title: 'Hướng Dẫn Tích Hợp AI Agent Vào Quy Trình Sale Từ A Đến Z',
    excerpt: 'Hướng dẫn chi tiết từng bước để tích hợp AI Agent vào quy trình bán hàng: từ cấu hình ban đầu đến đo lường hiệu quả sau triển khai.',
    author: { name: 'Quang Hải', role: 'Implementation Lead', initials: 'QH' },
    publishedAt: '2025-02-28',
    readTime: 12,
    featured: false,
    relatedAgents: ['agent-tu-van-chot-sale-24-7', 'agent-email-zalo-marketing-automation'],
    tags: ['hướng dẫn', 'triển khai', 'sale', 'integration', 'how-to'],
    views: 1980,
  },
  {
    id: 'xu-huong-ai-agents-2025-doanh-nghiep-dan-dau',
    slug: 'xu-huong-ai-agents-2025-doanh-nghiep-dan-dau',
    category: 'tin-tuc-xu-huong-ai-va-tu-dong-hoa',
    categoryLabel: 'Tin Tức Xu Hướng AI & Tự Động Hóa',
    title: 'Xu Hướng AI Agents Năm 2025: Doanh Nghiệp Nào Sẽ Dẫn Đầu',
    excerpt: '5 xu hướng AI Agent lớn nhất năm 2025 và những ngành nghề sẽ được hưởng lợi nhiều nhất. Phân tích từ 500+ doanh nghiệp đang triển khai AI Agents.',
    author: { name: 'Việt Anh', role: 'Market Analyst', initials: 'VA' },
    publishedAt: '2025-02-20',
    readTime: 7,
    featured: false,
    relatedAgents: ['agent-research-thi-truong-tu-dong', 'agent-phan-tich-doi-thu-canh-tranh-realtime'],
    tags: ['xu hướng', '2025', 'AI agents', 'industry', 'forecast'],
    views: 4120,
  },
  {
    id: 'roi-khi-su-dung-ai-agents-tinh-ra-sao',
    slug: 'roi-khi-su-dung-ai-agents-tinh-ra-sao',
    category: 'tin-tuc-huong-dan-trien-khai-ai-agents',
    categoryLabel: 'Tin Tức Hướng Dẫn Triển Khai AI Agents',
    title: 'ROI Khi Sử Dụng AI Agents: Tính Ra Sao Và Kỳ Vọng Thực Tế',
    excerpt: 'Cách tính ROI thực tế khi triển khai AI Agents: công thức, ví dụ số liệu từ doanh nghiệp thực tế và timeline hoàn vốn thông thường.',
    author: { name: 'Thu Lan', role: 'Content Lead', initials: 'TL' },
    publishedAt: '2025-02-15',
    readTime: 9,
    featured: false,
    relatedAgents: ['agent-phan-tich-ket-qua-kinh-doanh-tu-dong', 'agent-du-bao-doanh-thu-bang-ai'],
    tags: ['ROI', 'tính toán', 'hiệu quả', 'đầu tư', 'kết quả'],
    views: 3456,
  },
];

/* ─── GET /api/news — List articles ─────────────────────────── */
router.get('/', asyncHandler(async (req, res) => {
  const { category, page = 1, limit = 6, q } = req.query;

  let articles = [...newsData];

  if (category && category !== 'all') {
    articles = articles.filter(a => a.category === category);
  }

  if (q) {
    const query = q.toLowerCase();
    articles = articles.filter(a =>
      a.title.toLowerCase().includes(query) ||
      a.excerpt.toLowerCase().includes(query) ||
      a.tags.some(t => t.toLowerCase().includes(query))
    );
  }

  articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  const pageNum  = parseInt(page);
  const limitNum = parseInt(limit);
  const total    = articles.length;
  const paginated = articles.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  res.json({
    success: true,
    data: paginated,
    pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
  });
}));

/* ─── GET /api/news/categories — Category list ──────────────── */
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = [
    { slug: 'all',                                   label: 'Tất cả',                                count: newsData.length },
    { slug: 'tin-tuc-ai-agents',                     label: 'Tin Tức AI Agents',                     count: newsData.filter(a => a.category === 'tin-tuc-ai-agents').length },
    { slug: 'tin-tuc-claude-updates',                label: 'Tin Tức Claude Updates',                count: newsData.filter(a => a.category === 'tin-tuc-claude-updates').length },
    { slug: 'tin-tuc-case-study-doanh-nghiep',       label: 'Tin Tức Case Study Doanh Nghiệp',       count: newsData.filter(a => a.category === 'tin-tuc-case-study-doanh-nghiep').length },
    { slug: 'tin-tuc-huong-dan-trien-khai-ai-agents',label: 'Tin Tức Hướng Dẫn Triển Khai AI Agents',count: newsData.filter(a => a.category === 'tin-tuc-huong-dan-trien-khai-ai-agents').length },
    { slug: 'tin-tuc-xu-huong-ai-va-tu-dong-hoa',    label: 'Tin Tức Xu Hướng AI & Tự Động Hóa',    count: newsData.filter(a => a.category === 'tin-tuc-xu-huong-ai-va-tu-dong-hoa').length },
  ];

  res.json({ success: true, data: categories });
}));

/* ─── GET /api/news/trending — Trending articles ────────────── */
router.get('/trending', asyncHandler(async (req, res) => {
  const trending = [...newsData]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  res.json({ success: true, data: trending });
}));

/* ─── GET /api/news/:slug — Single article ───────────────────── */
router.get('/:slug', asyncHandler(async (req, res) => {
  const article = newsData.find(a => a.slug === req.params.slug);

  if (!article) {
    res.status(404);
    throw new Error(`Không tìm thấy bài viết: ${req.params.slug}`);
  }

  // Related articles (same category, excluding current)
  const related = newsData
    .filter(a => a.category === article.category && a.slug !== article.slug)
    .slice(0, 3);

  res.json({
    success: true,
    data: { ...article, relatedArticles: related },
  });
}));

/* ─── POST /api/news/:slug/comment — Add comment ─────────────── */
router.post('/:slug/comment', asyncHandler(async (req, res) => {
  const { name, email, comment } = req.body;

  if (!name || !comment) {
    return res.status(400).json({ success: false, message: 'Vui lòng điền tên và nội dung bình luận.' });
  }

  // TODO: Save to database + moderation queue
  console.log(`💬 New comment on ${req.params.slug}: ${name}`);

  res.json({
    success: true,
    message: 'Bình luận đã được gửi thành công!',
    data: {
      name,
      comment,
      createdAt: new Date().toISOString(),
      approved: false, // pending moderation
    },
  });
}));

module.exports = router;
