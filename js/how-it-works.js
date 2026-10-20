/* ============================================
   Task Flow — How It Works
   Smooth animations & interactions
   ============================================ */

(function () {
  'use strict';

  /* ---------- Shared navbar behavior ---------- */
  const navbar = document.getElementById('siteHeader');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const dropdowns = document.querySelectorAll('.site-header .dropdown');

  function onScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  mobileMenuBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('mobile-open');
    mobileMenuBtn.classList.toggle('open', isOpen);
    mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  dropdowns.forEach((dropdown) => {
    dropdown.querySelector('.dropdown-toggle').addEventListener('click', (event) => {
      event.stopPropagation();
      const wasOpen = dropdown.classList.contains('open');
      dropdowns.forEach((item) => item.classList.remove('open'));
      if (!wasOpen) dropdown.classList.add('open');
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header .dropdown')) {
      dropdowns.forEach((dropdown) => dropdown.classList.remove('open'));
    }
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('mobile-open');
      mobileMenuBtn.classList.remove('open');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      dropdowns.forEach((dropdown) => dropdown.classList.remove('open'));
    });
  });

  document.querySelectorAll('.site-header .get-started-btn').forEach((button) => {
    button.addEventListener('click', () => {
      window.location.href = 'signup.html';
    });
  });

  document.querySelectorAll('.site-header .login-btn').forEach((button) => {
    button.addEventListener('click', () => {
      window.location.href = 'login.html';
    });
  });

  /* ---------- Hero entrance animations ---------- */
  function animateHero() {
    const items = document.querySelectorAll('.hero .anim-item');
    items.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 150 + i * 180);
    });

    // Workflow nodes sequential
    const nodes = document.querySelectorAll('#heroWorkflow .node');
    const lines = document.querySelectorAll('#heroWorkflow .node-line');
    nodes.forEach((node, i) => {
      setTimeout(() => {
        node.classList.add('visible');
        if (lines[i]) {
          setTimeout(() => lines[i].classList.add('visible'), 200);
        }
      }, 600 + i * 280);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateHero);
  } else {
    animateHero();
  }

  /* ---------- Intersection Observer — section reveal ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Trigger count-up when section becomes visible
          entry.target.querySelectorAll('.count-up').forEach(animateCountUp);
          // Trigger progress bars
          entry.target.querySelectorAll('.progress-fill').forEach((bar) => {
            const val = bar.getAttribute('data-value');
            if (val) bar.style.width = val + '%';
          });
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  /* ---------- Count-up numbers ---------- */
  function animateCountUp(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = '1';
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-q').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all others
      document.querySelectorAll('.faq-item.open').forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ---------- Task card status animation ---------- */
  const statuses = ['Created', 'Assigned', 'Accepted', 'In Progress'];
  const statusColors = {
    Created: { bg: '#EEF2FF', color: '#6366F1' },
    Assigned: { bg: '#F0FDF4', color: '#16A34A' },
    Accepted: { bg: '#FEF3C7', color: '#D97706' },
    'In Progress': { bg: '#FCE7F3', color: '#DB2777' }
  };
  let statusIdx = 0;
  const statusBadge = document.getElementById('taskStatus');

  if (statusBadge) {
    setInterval(() => {
      statusIdx = (statusIdx + 1) % statuses.length;
      const name = statuses[statusIdx];
      statusBadge.textContent = name;
      const c = statusColors[name];
      statusBadge.style.background = c.bg;
      statusBadge.style.color = c.color;
    }, 2200);
  }

  /* ---------- Explore the Workflow button ---------- */
  document.querySelectorAll('a[href="#overview"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('overview');
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();