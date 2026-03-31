# ⚡ Claude Marketplace — claudemarketplace.vn

> AI Agent Marketplace chuyên biệt cho doanh nghiệp Việt Nam

---

## 📁 Cấu trúc thư mục

```
Claudemarketplace/
├── frontend/                    # Giao diện người dùng (HTML/CSS/JS)
│   ├── index.html               # Trang chủ — /
│   ├── marketplace.html         # Danh sách agents — /ai-agents
│   ├── agent-detail.html        # Chi tiết agent — /ai-agents/[slug]
│   ├── news.html                # Tin tức — /tin-tuc-ai-agents
│   ├── news-detail.html         # Bài viết — /tin-tuc-[cat]/[slug]
│   ├── services.html            # Dịch vụ — /dich-vu
│   ├── contact.html             # Liên hệ — /lien-he
│   ├── css/
│   │   ├── style.css            # Design system: variables, reset, layout
│   │   └── components.css       # Page-specific components
│   └── js/
│       └── main.js              # Navigation, animations, interactions
│
└── backend/                     # API Server (Node.js / Express)
    ├── server.js                # Entry point
    ├── package.json
    ├── .env.example             # Environment variables template
    ├── routes/
    │   ├── agents.js            # GET/POST /api/agents
    │   ├── news.js              # GET/POST /api/news
    │   ├── services.js          # GET/POST /api/services
    │   └── contact.js           # POST /api/contact
    ├── middleware/
    │   └── errorHandler.js      # 404 + global error handler
    └── data/
        └── agents.json          # 22 agents data (JSON static)
```

---

## 🚀 Khởi động dự án

### Frontend (Static)
Mở `frontend/index.html` trong trình duyệt hoặc dùng Live Server extension (VS Code).

### Backend (API Server)
```bash
cd backend
cp .env.example .env       # Tạo file .env từ template
npm install                # Cài dependencies
npm run dev                # Chạy development server (nodemon)
# hoặc
npm start                  # Chạy production server
```

Server chạy tại: `http://localhost:5000`

---

## 📡 API Endpoints

### Agents
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/agents` | Lấy danh sách agents (filter, search, sort, paginate) |
| GET | `/api/agents/stats` | Thống kê marketplace |
| GET | `/api/agents/featured` | Top 4 agents bán chạy |
| GET | `/api/agents/:slug` | Chi tiết 1 agent |
| POST | `/api/agents/:slug/preorder` | Đặt hàng trước |
| POST | `/api/agents/:slug/trial` | Yêu cầu dùng thử 7 ngày |
| POST | `/api/agents/:slug/wishlist` | Thêm vào wishlist |

### News
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/news` | Danh sách bài viết (filter by category) |
| GET | `/api/news/categories` | Danh sách categories |
| GET | `/api/news/trending` | Top 5 bài đọc nhiều nhất |
| GET | `/api/news/:slug` | Chi tiết bài viết |
| POST | `/api/news/:slug/comment` | Gửi bình luận |

### Services
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/services` | Danh sách dịch vụ |
| GET | `/api/services/:slug` | Chi tiết dịch vụ |
| POST | `/api/services/consultation` | Đăng ký tư vấn miễn phí |
| POST | `/api/services/training-register` | Đăng ký khóa đào tạo |

### Contact & Newsletter
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/contact` | Gửi form liên hệ |
| POST | `/api/contact/demo` | Đặt lịch demo call |
| POST | `/api/newsletter/subscribe` | Đăng ký nhận tin |

---

## 🎨 Design System

### Màu sắc
```css
--color-bg-primary:   #0a0f1e   /* Background chính */
--color-primary:      #2563eb   /* Electric blue */
--color-accent:       #06b6d4   /* Cyan */
--color-text-primary: #f1f5f9   /* Text chính */
```

### Quy tắc URL
- Agent: `/ai-agents/agent-[ten-agent-slug]`
- News: `/tin-tuc-[category-slug]/[bai-viet-slug]`
- Service: `/dich-vu/[slug-day-du]`
- URL sinh từ H1, giữ nguyên keyword, không giới hạn ký tự

### Trạng thái Agent
- `live` — Badge xanh "● Đang hoạt động" + số DN đang dùng + rating
- `preorder` — Badge cam "◎ Đang phát triển" + ngày dự kiến + pre-order price (-20%)

---

## 🗺️ Sitemap

```
/                                                     → Trang chủ
/ai-agents                                            → Marketplace
/ai-agents/agent-tu-van-chot-sale-24-7               → Agent detail
/ai-agents/agent-phan-tich-ket-qua-kinh-doanh-tu-dong
... (22 agents total)

/tin-tuc-ai-agents                                    → News: AI Agents
/tin-tuc-claude-updates                               → News: Claude Updates
/tin-tuc-case-study-doanh-nghiep                      → News: Case Study
/tin-tuc-huong-dan-trien-khai-ai-agents               → News: Hướng dẫn
/tin-tuc-xu-huong-ai-va-tu-dong-hoa                   → News: Xu hướng

/tin-tuc-ai-agents/ai-agent-la-gi-giai-thich-toan-dien-cho-doanh-nghiep-viet-nam
... (nhiều bài viết)

/dich-vu
/dich-vu/dao-tao-trien-khai-ai-agents-cho-doanh-nghiep
/dich-vu/tu-van-setup-va-chuyen-giao-bo-ai-agents-cho-doanh-nghiep

/ve-chung-toi
/lien-he
```

---

## 🔧 Công nghệ sử dụng

**Frontend:** HTML5 · CSS3 (Custom Properties) · Vanilla JavaScript · Google Fonts (Inter)

**Backend:** Node.js · Express.js · CORS · Helmet · Morgan · Rate Limiting · Compression

**Tích hợp tương lai:** MongoDB · JWT Auth · Nodemailer · Stripe/VNPay · Cloudinary

---

## 📋 Roadmap phát triển

- [ ] Kết nối database MongoDB
- [ ] Authentication & User dashboard
- [ ] Payment gateway (VNPay/Stripe)
- [ ] Admin panel quản lý agents, news, orders
- [ ] Email automation (welcome, confirmation, onboarding)
- [ ] Zalo OA integration cho notifications
- [ ] Analytics dashboard (views, conversions, funnel)
- [ ] SEO: Dynamic sitemap.xml, robots.txt, OG images
- [ ] PWA (Progressive Web App) support

---

*Claude Marketplace © 2025 — claudemarketplace.vn*
