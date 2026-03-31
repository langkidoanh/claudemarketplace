/**
 * CLAUDEMARKETPLACE.VN — Main JavaScript
 * Navigation, Scroll effects, Interactions, Utilities
 */

'use strict';

/* ─── CONSTANTS ─────────────────────────────────────────────── */
const NAV_SCROLL_THRESHOLD = 20;
const COUNTER_DURATION     = 2000;
const TOAST_DURATION       = 3500;

/* ─── DOM READY ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollReveal();
  initScrollTop();
  initCounters();
  initTabs();
  initCategoryFilter();
  initAgentSearch();
  initTooltips();
  initParticles();
  initTypingEffect();
  initNewsletterForm();
  initMobileMenu();
  initTOC();
  initComments();
  initROICalculator();
  initWishlist();
  setActiveNavLink();
});

/* ─── NAVIGATION ─────────────────────────────────────────────── */
function initNavigation() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const handleScroll = () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > NAV_SCROLL_THRESHOLD);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on init
}

function setActiveNavLink() {
  const links = document.querySelectorAll('.nav__link');
  const path  = window.location.pathname;

  links.forEach(link => {
    const href = link.getAttribute('href') || '';
    const isActive = path === href || (href !== '/' && path.startsWith(href));
    link.classList.toggle('active', isActive);
  });
}

/* ─── MOBILE MENU ─────────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger = document.querySelector('.nav__hamburger');
  const navLinks  = document.querySelector('.nav__links');
  if (!hamburger || !navLinks) return;

  let isOpen = false;

  hamburger.addEventListener('click', () => {
    isOpen = !isOpen;
    navLinks.style.display = isOpen ? 'flex' : '';
    navLinks.style.flexDirection = isOpen ? 'column' : '';
    navLinks.style.position = isOpen ? 'fixed' : '';
    navLinks.style.top = isOpen ? '72px' : '';
    navLinks.style.left = isOpen ? '0' : '';
    navLinks.style.right = isOpen ? '0' : '';
    navLinks.style.background = isOpen ? 'rgba(10,15,30,0.98)' : '';
    navLinks.style.padding = isOpen ? '16px' : '';
    navLinks.style.zIndex = isOpen ? '200' : '';
    navLinks.style.borderBottom = isOpen ? '1px solid rgba(255,255,255,0.08)' : '';

    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (isOpen && !hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.click();
    }
  });
}

/* ─── SCROLL REVEAL ──────────────────────────────────────────── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ─── SCROLL TO TOP ──────────────────────────────────────────── */
function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ─── COUNTER ANIMATION ──────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target   = parseFloat(el.dataset.count);
  const suffix   = el.dataset.suffix || '';
  const prefix   = el.dataset.prefix || '';
  const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
  const start    = 0;
  const startTime = performance.now();

  const update = (currentTime) => {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / COUNTER_DURATION, 1);
    const eased    = easeOutCubic(progress);
    const current  = start + (target - start) * eased;

    el.textContent = prefix + current.toFixed(decimals) + suffix;

    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = prefix + target.toFixed(decimals) + suffix;
  };

  requestAnimationFrame(update);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/* ─── TABS ───────────────────────────────────────────────────── */
function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach(tabContainer => {
    const tabEls    = tabContainer.querySelectorAll('[data-tab]');
    const panelId   = tabContainer.dataset.tabs;
    const panelContainer = document.getElementById(panelId);
    if (!panelContainer) return;

    const panels = panelContainer.querySelectorAll('[data-panel]');

    tabEls.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;

        // Update tabs
        tabEls.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update panels
        panels.forEach(p => {
          const isActive = p.dataset.panel === target;
          p.style.display = isActive ? 'block' : 'none';
          if (isActive) {
            p.style.animation = 'fade-in 0.3s ease';
          }
        });
      });
    });

    // Show first tab by default
    if (tabEls[0]) tabEls[0].click();
  });
}

/* ─── CATEGORY FILTER (Marketplace) ──────────────────────────── */
function initCategoryFilter() {
  const sidebarItems = document.querySelectorAll('.category-sidebar__item');
  const agentCards   = document.querySelectorAll('.agent-card[data-dept]');
  const resultCount  = document.querySelector('.marketplace-results-count strong');

  if (!sidebarItems.length || !agentCards.length) return;

  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      const dept = item.dataset.dept;

      // Update active state
      sidebarItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Filter cards
      let visible = 0;
      agentCards.forEach(card => {
        const show = dept === 'all' || card.dataset.dept === dept;
        card.style.display = show ? '' : 'none';
        if (show) {
          visible++;
          card.style.animation = 'fade-up 0.4s ease both';
        }
      });

      if (resultCount) {
        resultCount.textContent = visible;
      }
    });
  });
}

/* ─── AGENT SEARCH ───────────────────────────────────────────── */
function initAgentSearch() {
  const searchInput = document.querySelector('.filter-bar__search input');
  const agentCards  = document.querySelectorAll('.agent-card[data-name]');
  const resultCount = document.querySelector('.marketplace-results-count strong');

  if (!searchInput || !agentCards.length) return;

  let debounceTimer;

  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const query = searchInput.value.toLowerCase().trim();
      let visible = 0;

      agentCards.forEach(card => {
        const name = (card.dataset.name || '').toLowerCase();
        const desc = (card.dataset.desc || '').toLowerCase();
        const dept = (card.dataset.dept || '').toLowerCase();
        const show = !query || name.includes(query) || desc.includes(query) || dept.includes(query);

        card.style.display = show ? '' : 'none';
        if (show) {
          visible++;
          card.style.animation = 'fade-up 0.3s ease both';
        }
      });

      if (resultCount) resultCount.textContent = visible;
    }, 200);
  });
}

/* ─── STATUS FILTER ──────────────────────────────────────────── */
function initStatusFilter() {
  const statusTabs  = document.querySelectorAll('[data-status-filter]');
  const agentCards  = document.querySelectorAll('.agent-card[data-status]');

  if (!statusTabs.length) return;

  statusTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const status = tab.dataset.statusFilter;

      statusTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      agentCards.forEach(card => {
        const show = status === 'all' || card.dataset.status === status;
        card.style.display = show ? '' : 'none';
      });
    });
  });
}

/* ─── NEWS CATEGORY FILTER ───────────────────────────────────── */
function initNewsCategoryFilter() {
  const catLinks = document.querySelectorAll('.news-cat-link[data-cat]');
  const newsCards = document.querySelectorAll('.news-card[data-cat]');

  if (!catLinks.length) return;

  catLinks.forEach(link => {
    link.addEventListener('click', () => {
      const cat = link.dataset.cat;

      catLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      newsCards.forEach(card => {
        const show = cat === 'all' || card.dataset.cat === cat;
        card.style.display = show ? '' : 'none';
        if (show) card.style.animation = 'fade-up 0.3s ease both';
      });
    });
  });
}

/* ─── TOOLTIPS ───────────────────────────────────────────────── */
function initTooltips() {
  document.querySelectorAll('[data-tooltip]').forEach(el => {
    const tip = document.createElement('div');
    tip.className = 'tooltip';
    tip.textContent = el.dataset.tooltip;
    tip.style.cssText = `
      position: absolute;
      background: rgba(15,23,42,0.95);
      color: #f1f5f9;
      font-size: 12px;
      padding: 6px 10px;
      border-radius: 6px;
      white-space: nowrap;
      pointer-events: none;
      z-index: 1000;
      border: 1px solid rgba(255,255,255,0.1);
      opacity: 0;
      transition: opacity 0.15s ease;
    `;
    document.body.appendChild(tip);

    el.addEventListener('mouseenter', (e) => {
      const rect = el.getBoundingClientRect();
      tip.style.left = rect.left + rect.width / 2 - tip.offsetWidth / 2 + 'px';
      tip.style.top  = rect.top - tip.offsetHeight - 8 + window.scrollY + 'px';
      tip.style.opacity = '1';
    });

    el.addEventListener('mouseleave', () => {
      tip.style.opacity = '0';
    });
  });
}

/* ─── PARTICLES (Hero section) ───────────────────────────────── */
function initParticles() {
  const container = document.querySelector('.hero__particles');
  if (!container) return;

  const count = 40;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const x    = Math.random() * 100;
    const y    = Math.random() * 100;
    const dur  = Math.random() * 15 + 10;
    const delay = Math.random() * -20;
    const opacity = Math.random() * 0.4 + 0.1;

    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      top: ${y}%;
      border-radius: 50%;
      background: ${Math.random() > 0.5 ? '#2563eb' : '#06b6d4'};
      opacity: ${opacity};
      animation: particle-float ${dur}s ${delay}s linear infinite;
    `;
    container.appendChild(particle);
  }

  // Add keyframes dynamically
  if (!document.getElementById('particle-style')) {
    const style = document.createElement('style');
    style.id = 'particle-style';
    style.textContent = `
      @keyframes particle-float {
        0%   { transform: translateY(0) translateX(0) scale(1); opacity: var(--op); }
        25%  { transform: translateY(-30px) translateX(15px) scale(1.1); }
        50%  { transform: translateY(-60px) translateX(-10px) scale(0.9); opacity: calc(var(--op) * 0.5); }
        75%  { transform: translateY(-30px) translateX(20px) scale(1.05); }
        100% { transform: translateY(0) translateX(0) scale(1); opacity: var(--op); }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ─── TYPING EFFECT ──────────────────────────────────────────── */
function initTypingEffect() {
  const el = document.querySelector('[data-typing]');
  if (!el) return;

  const phrases = JSON.parse(el.dataset.typing || '[]');
  if (!phrases.length) return;

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let pauseTimer  = null;

  const typeSpeed   = 80;
  const deleteSpeed = 40;
  const pauseTime   = 2000;

  function type() {
    const phrase = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = phrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = phrase.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === phrase.length) {
      pauseTimer = setTimeout(() => { isDeleting = true; type(); }, pauseTime);
      return;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }

    const delay = isDeleting ? deleteSpeed : typeSpeed;
    setTimeout(type, delay);
  }

  // Add cursor
  el.style.borderRight = '2px solid #06b6d4';
  el.style.animation   = 'blink-cursor 1s step-end infinite';

  if (!document.getElementById('cursor-style')) {
    const style = document.createElement('style');
    style.id = 'cursor-style';
    style.textContent = `
      @keyframes blink-cursor {
        0%, 100% { border-right-color: #06b6d4; }
        50%       { border-right-color: transparent; }
      }
    `;
    document.head.appendChild(style);
  }

  type();
}

/* ─── NEWSLETTER FORM ────────────────────────────────────────── */
function initNewsletterForm() {
  const forms = document.querySelectorAll('.newsletter-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = input?.value?.trim();

      if (!email || !isValidEmail(email)) {
        showToast('⚠️ Vui lòng nhập email hợp lệ', 'warning');
        return;
      }

      // Simulate API call
      const btn = form.querySelector('button[type="submit"]');
      const origText = btn?.textContent;
      if (btn) {
        btn.textContent = 'Đang đăng ký...';
        btn.disabled = true;
      }

      setTimeout(() => {
        showToast('✅ Đăng ký nhận tin thành công!', 'success');
        if (input) input.value = '';
        if (btn) {
          btn.textContent = origText;
          btn.disabled = false;
        }
      }, 1200);
    });
  });
}

/* ─── TABLE OF CONTENTS ──────────────────────────────────────── */
function initTOC() {
  const tocList    = document.querySelector('.toc-list');
  const content    = document.querySelector('.article-content');
  if (!tocList || !content) return;

  const headings = content.querySelectorAll('h2, h3');

  headings.forEach((h, i) => {
    const id = h.id || `heading-${i}`;
    h.id = id;

    const item = document.createElement('div');
    item.className = `toc-item ${h.tagName === 'H3' ? 'toc-item--h3' : ''}`;
    item.textContent = h.textContent;
    item.dataset.target = id;
    tocList.appendChild(item);

    item.addEventListener('click', () => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Highlight active TOC item on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        tocList.querySelectorAll('.toc-item').forEach(item => {
          item.classList.toggle('active', item.dataset.target === id);
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  headings.forEach(h => observer.observe(h));
}

/* ─── COMMENTS ───────────────────────────────────────────────── */
function initComments() {
  const commentForm = document.querySelector('.comment-form');
  if (!commentForm) return;

  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = commentForm.querySelector('[name="name"]')?.value?.trim();
    const comment = commentForm.querySelector('[name="comment"]')?.value?.trim();

    if (!name || !comment) {
      showToast('⚠️ Vui lòng điền đầy đủ thông tin', 'warning');
      return;
    }

    const container = document.querySelector('.comments-list');
    if (!container) return;

    const newComment = createCommentHTML({ name, comment, date: 'Vừa xong' });
    const div = document.createElement('div');
    div.innerHTML = newComment;
    div.style.animation = 'fade-up 0.4s ease';
    container.prepend(div.firstElementChild);

    commentForm.reset();
    showToast('✅ Bình luận đã được gửi thành công!');
  });

  // Like buttons
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('comment-action--like')) {
      const current = parseInt(e.target.dataset.likes || '0');
      e.target.dataset.likes = current + 1;
      e.target.textContent = `👍 Thích (${current + 1})`;
    }
  });
}

function createCommentHTML({ name, comment, date }) {
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  return `
    <div class="comment-card">
      <div class="comment-avatar">${initials}</div>
      <div class="comment-body">
        <div class="comment-header">
          <span class="comment-name">${escapeHTML(name)}</span>
          <span class="comment-date">${date}</span>
        </div>
        <p class="comment-text">${escapeHTML(comment)}</p>
        <div class="comment-actions">
          <span class="comment-action comment-action--like" data-likes="0">👍 Thích (0)</span>
          <span class="comment-action">💬 Trả lời</span>
        </div>
      </div>
    </div>
  `;
}

/* ─── ROI CALCULATOR ─────────────────────────────────────────── */
function initROICalculator() {
  const calc = document.querySelector('.roi-calculator');
  if (!calc) return;

  const inputs  = calc.querySelectorAll('input[data-roi]');
  const result  = calc.querySelector('.roi-result-value');
  const calcBtn = calc.querySelector('[data-roi-calc]');

  const calculate = () => {
    const values = {};
    inputs.forEach(input => {
      values[input.dataset.roi] = parseFloat(input.value) || 0;
    });

    // Generic ROI formula: (hours_saved * hourly_rate * 12 - agent_cost) / agent_cost * 100
    const hoursSaved    = values.hours_saved || 0;
    const hourlyRate    = values.hourly_rate || 0;
    const agentCost     = values.agent_cost  || 5000000;
    const annualSaving  = hoursSaved * hourlyRate * 12;
    const roi           = ((annualSaving - agentCost) / agentCost * 100).toFixed(0);

    if (result) {
      result.textContent = roi > 0 ? `+${roi}%` : `${roi}%`;
      result.style.color = roi > 0 ? '' : '#ef4444';
      result.style.animation = 'counter-up 0.5s ease';
    }
  };

  if (calcBtn) {
    calcBtn.addEventListener('click', calculate);
  }

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      clearTimeout(input._t);
      input._t = setTimeout(calculate, 400);
    });
  });
}

/* ─── WISHLIST ───────────────────────────────────────────────── */
function initWishlist() {
  const wishlistBtns = document.querySelectorAll('[data-wishlist]');
  const storage      = getWishlist();

  wishlistBtns.forEach(btn => {
    const id = btn.dataset.wishlist;
    const isSaved = storage.includes(id);
    updateWishlistBtn(btn, isSaved);

    btn.addEventListener('click', () => {
      const list    = getWishlist();
      const idx     = list.indexOf(id);
      const adding  = idx === -1;

      if (adding) list.push(id);
      else list.splice(idx, 1);

      localStorage.setItem('cm_wishlist', JSON.stringify(list));
      updateWishlistBtn(btn, adding);
      showToast(adding ? '❤️ Đã thêm vào danh sách yêu thích' : '🗑️ Đã xóa khỏi danh sách yêu thích');
    });
  });
}

function getWishlist() {
  try { return JSON.parse(localStorage.getItem('cm_wishlist') || '[]'); }
  catch { return []; }
}

function updateWishlistBtn(btn, isSaved) {
  btn.textContent  = isSaved ? '❤️' : '🤍';
  btn.title        = isSaved ? 'Xóa khỏi danh sách yêu thích' : 'Lưu vào danh sách yêu thích';
  btn.style.color  = isSaved ? '#ef4444' : '';
}

/* ─── COMPARE AGENTS ─────────────────────────────────────────── */
const compareList = [];

function toggleCompare(id, name) {
  const idx = compareList.findIndex(i => i.id === id);

  if (idx > -1) {
    compareList.splice(idx, 1);
    showToast(`Đã xóa "${name}" khỏi so sánh`);
  } else if (compareList.length >= 3) {
    showToast('⚠️ Chỉ có thể so sánh tối đa 3 agents', 'warning');
    return;
  } else {
    compareList.push({ id, name });
    showToast(`✅ Đã thêm "${name}" vào so sánh`);
  }

  updateCompareBar();
}

function updateCompareBar() {
  let bar = document.getElementById('compare-bar');

  if (!compareList.length) {
    if (bar) bar.remove();
    return;
  }

  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'compare-bar';
    bar.style.cssText = `
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      background: rgba(10,15,30,0.96); border: 1px solid rgba(37,99,235,0.4);
      border-radius: 16px; padding: 12px 20px; z-index: 500;
      display: flex; align-items: center; gap: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      backdrop-filter: blur(12px);
    `;
    document.body.appendChild(bar);
  }

  bar.innerHTML = `
    <span style="font-size:13px; color:#94a3b8;">So sánh: <strong style="color:#f1f5f9;">${compareList.map(i => i.name).join(', ')}</strong></span>
    <button onclick="openCompareModal()" style="background: linear-gradient(135deg,#2563eb,#06b6d4); color:white; border:none; padding:8px 16px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer;">
      So sánh ngay
    </button>
    <button onclick="clearCompare()" style="background:none; border:none; color:#64748b; cursor:pointer; font-size:18px;">✕</button>
  `;
}

function clearCompare() {
  compareList.length = 0;
  updateCompareBar();
}

/* ─── TOAST NOTIFICATION ─────────────────────────────────────── */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = message;

  const colors = {
    success: '#10b981',
    warning: '#f59e0b',
    error:   '#ef4444',
    info:    '#06b6d4',
  };

  toast.style.borderLeftColor = colors[type] || colors.info;
  toast.style.borderLeftWidth = '3px';

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity   = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, TOAST_DURATION);
}

/* ─── SORT AGENTS ─────────────────────────────────────────────── */
function sortAgents(criteria) {
  const grid   = document.querySelector('.marketplace-grid');
  if (!grid) return;

  const cards  = Array.from(grid.querySelectorAll('.agent-card'));

  cards.sort((a, b) => {
    if (criteria === 'price-asc') {
      return getPrice(a) - getPrice(b);
    } else if (criteria === 'price-desc') {
      return getPrice(b) - getPrice(a);
    } else if (criteria === 'rating') {
      return getRating(b) - getRating(a);
    } else if (criteria === 'popular') {
      return getUsers(b) - getUsers(a);
    }
    return 0;
  });

  cards.forEach((card, i) => {
    card.style.order = i;
    card.style.animation = `fade-up 0.3s ease ${i * 0.05}s both`;
  });
}

function getPrice(card)  { return parseFloat(card.dataset.price  || '0'); }
function getRating(card) { return parseFloat(card.dataset.rating || '0'); }
function getUsers(card)  { return parseInt(card.dataset.users   || '0'); }

/* ─── UTILITIES ──────────────────────────────────────────────── */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function formatPrice(num) {
  return new Intl.NumberFormat('vi-VN').format(num) + 'đ';
}

function formatNumber(num) {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}

/* ─── EXPOSE GLOBAL FUNCTIONS ────────────────────────────────── */
window.CM = {
  showToast,
  sortAgents,
  toggleCompare,
  clearCompare,
  slugify,
  formatPrice,
  initStatusFilter,
  initNewsCategoryFilter,
};
