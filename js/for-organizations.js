/* ============================================
   Task Flow – For Organizations
   Interactive Behaviors & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initCounters();
  initProgressBars();
  initFAQ();
  initProjectFilters();
  initBackToTop();
  initHeroEntrance();
});

/* ---------- Navbar scroll state ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Mobile Menu ---------- */
function initMobileMenu() {
  const menuButton = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  if (!menuButton || !navMenu) return;

  menuButton.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('mobile-open');
    menuButton.classList.toggle('open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', event => {
      event.stopPropagation();
      const dropdown = toggle.closest('.dropdown');
      const isOpen = dropdown.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));

      navMenu.querySelectorAll('.dropdown').forEach(item => {
        if (item !== dropdown) {
          item.classList.remove('open');
          item.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
        }
      });
    });
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.dropdown')) {
      navMenu.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.classList.remove('open');
        dropdown.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
      });
    }
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('mobile-open');
      menuButton.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });

}

/* ---------- Scroll-triggered animations ---------- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Trigger nested progress bars & counters when section becomes visible
        animateNested(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

function animateNested(container) {
  // Progress fills
  container.querySelectorAll('.progress-fill, .mini-fill, .health-fill, .wl-fill, .sb-bar div, .rb div, .bar').forEach(el => {
    el.classList.add('animated');
  });
}

/* ---------- Number counters ---------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        animateCounter(el, target, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateCounter(el, target, suffix) {
  const duration = 1400;
  const start = performance.now();
  const startVal = 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutExpo
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = Math.round(startVal + (target - startVal) * eased);
    el.textContent = current + suffix;
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
}

/* ---------- Progress bars (hero + general) ---------- */
function initProgressBars() {
  // Hero bars animate on load shortly after entrance
  setTimeout(() => {
    document.querySelectorAll('.hero .progress-fill, .hero .mini-fill').forEach(el => {
      el.classList.add('animated');
    });
  }, 800);

  // Hero metric counters
  const heroMetrics = document.querySelectorAll('.hero .metric-value[data-count]');
  setTimeout(() => {
    heroMetrics.forEach(el => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      animateCounter(el, target, '');
    });
  }, 600);
}

/* ---------- FAQ Accordion ---------- */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      items.forEach(i => i.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

/* ---------- Project Filters (dept + status) ---------- */
function initProjectFilters() {
  const deptButtons = document.querySelectorAll('#projects .filter-bar:not(.status-filters) .filter-btn');
  const statusButtons = document.querySelectorAll('#projects .status-filters .filter-btn');
  const rows = document.querySelectorAll('.project-row');
  if (!rows.length) return;

  let activeDept = 'all';
  let activeStatus = 'all';

  function applyFilters() {
    rows.forEach(row => {
      const dept = row.getAttribute('data-dept');
      const status = row.getAttribute('data-status');
      const deptMatch = activeDept === 'all' || dept === activeDept;
      const statusMatch = activeStatus === 'all' || status === activeStatus;
      row.style.display = (deptMatch && statusMatch) ? '' : 'none';
    });
  }

  deptButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      deptButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeDept = btn.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  statusButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      statusButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeStatus = btn.getAttribute('data-status') || 'all';
      applyFilters();
    });
  });
}

/* ---------- Back to Top ---------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- Hero entrance animations ---------- */
function initHeroEntrance() {
  const els = document.querySelectorAll('.hero .animate-fade-up');
  // Small delay so page paints first
  requestAnimationFrame(() => {
    setTimeout(() => {
      els.forEach(el => el.classList.add('visible'));
    }, 100);
  });
}