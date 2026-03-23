/* ============================================
   INDUMEC — Catalog Page JS
   Search, Filter, and Interaction Logic
   ============================================ */

(function () {
  'use strict';

  // --- DOM ---
  const searchInput = document.getElementById('cat-search');
  const searchCount = document.getElementById('cat-search-count');
  const grid = document.getElementById('cat-grid');
  const noResults = document.getElementById('cat-no-results');
  const filterButtons = document.querySelectorAll('.cat-filter');
  const cards = document.querySelectorAll('.cat-card');
  const categoryHeaders = document.querySelectorAll('.cat-category-header');
  const header = document.getElementById('cat-header');

  let activeFilter = 'all';

  // --- Header Scroll Effect ---
  function handleHeaderScroll() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  // --- Filter Logic ---
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;

      // Clear search
      searchInput.value = '';
      applyFilters();
    });
  });

  // --- Search Logic ---
  searchInput.addEventListener('input', () => {
    // Reset filter to 'all' when searching
    if (searchInput.value.trim()) {
      filterButtons.forEach(b => b.classList.remove('active'));
      filterButtons[0].classList.add('active');
      activeFilter = 'all';
    }
    applyFilters();
  });

  // --- Apply Filters and Search ---
  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCards = 0;
    const visibleCategories = new Set();

    cards.forEach((card) => {
      const category = card.dataset.category;
      const keywords = (card.dataset.keywords || '').toLowerCase();
      const title = card.querySelector('.cat-card-title').textContent.toLowerCase();
      const desc = card.querySelector('.cat-card-desc').textContent.toLowerCase();
      const allText = keywords + ' ' + title + ' ' + desc;

      const matchesFilter = activeFilter === 'all' || category === activeFilter;
      const matchesSearch = !query || allText.includes(query);

      if (matchesFilter && matchesSearch) {
        card.classList.remove('hidden');
        card.style.animation = 'cardFadeIn 0.4s ease forwards';
        card.style.animationDelay = (visibleCards * 0.04) + 's';
        visibleCards++;
        visibleCategories.add(category);
      } else {
        card.classList.add('hidden');
        card.style.animation = '';
      }
    });

    // Show/hide category headers
    categoryHeaders.forEach((hdr) => {
      const category = hdr.dataset.category;
      const matchesFilter = activeFilter === 'all' || category === activeFilter;
      const matchesSearch = !query || visibleCategories.has(category);

      if (matchesFilter && matchesSearch) {
        hdr.classList.remove('hidden');
      } else {
        hdr.classList.add('hidden');
      }
    });

    // Update counter
    if (query) {
      searchCount.textContent = visibleCards + ' resultado' + (visibleCards !== 1 ? 's' : '');
    } else {
      searchCount.textContent = '';
    }

    // No results
    noResults.style.display = visibleCards === 0 ? 'block' : 'none';
  }

  // --- Smooth Scroll to Category on Filter Click ---
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.filter !== 'all') {
        const targetSection = document.getElementById('sec-' + btn.dataset.filter);
        if (targetSection) {
          setTimeout(() => {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }
    });
  });

  // --- Card Entrance Animations ---
  const style = document.createElement('style');
  style.textContent = `
    @keyframes cardFadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  // --- Initial scroll-based animations (IntersectionObserver) ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'cardFadeIn 0.6s ease forwards';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  cards.forEach((card) => {
    card.style.opacity = '0';
    observer.observe(card);
  });

  categoryHeaders.forEach((hdr) => {
    hdr.style.opacity = '0';
    observer.observe(hdr);
  });

  // --- Mobile Menu Toggle ---
  function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('site-nav');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      nav.classList.toggle('open');
    });

    const links = nav.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        btn.classList.remove('active');
        nav.classList.remove('open');
      });
    });
  }

  initMobileMenu();

  // Show bottom sticky bar after 2 seconds
  setTimeout(() => {
    const stickyBar = document.getElementById('bottom-sticky-bar');
    if (stickyBar) stickyBar.classList.add('visible');
  }, 2000);

})();
