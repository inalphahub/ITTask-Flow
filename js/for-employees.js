/**
 * Task Flow — For Employees Page
 * Smooth animations, mobile menu, sticky nav, FAQ, scroll spy
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ========== NAVBAR SCROLL ========== */
  const navbar = document.getElementById('navbar');
  function handleNavScroll() {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ========== MOBILE MENU ========== */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const body = document.body;

  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.contains('open');
    hamburger.classList.toggle('active', !isOpen);
    mobileMenu.classList.toggle('open', !isOpen);
    hamburger.setAttribute('aria-expanded', String(!isOpen));
    body.style.overflow = isOpen ? '' : 'hidden';
  }

  hamburger.addEventListener('click', toggleMobileMenu);

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });

  // Mobile dropdown toggles
  document.querySelectorAll('.mobile-dropdown-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const menu = btn.nextElementSibling;
      const isOpen = menu.classList.contains('open');
      // Close siblings
      btn.closest('.mobile-menu-inner')
        .querySelectorAll('.mobile-dropdown-menu')
        .forEach((m) => m.classList.remove('open'));
      btn.closest('.mobile-menu-inner')
        .querySelectorAll('.mobile-dropdown-toggle')
        .forEach((b) => b.classList.remove('active'));
      if (!isOpen) {
        menu.classList.add('open');
        btn.classList.add('active');
      }
    });
  });

  // Desktop dropdown keyboard / click support
  document.querySelectorAll('.nav-dropdown').forEach((dropdown) => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = dropdown.classList.contains('open');
      document.querySelectorAll('.nav-dropdown').forEach((d) => d.classList.remove('open'));
      if (!isOpen) dropdown.classList.add('open');
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) {
      document.querySelectorAll('.nav-dropdown').forEach((d) => d.classList.remove('open'));
    }
  });

  /* ========== SMOOTH ANCHOR SCROLL ========== */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const offset = navHeight + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    });
  });

  /* ========== SCROLL ANIMATIONS ========== */
  if (!prefersReducedMotion) {
    const animated = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    animated.forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll('[data-animate]').forEach((el) => {
      el.classList.add('visible');
    });
  }

  /* ========== FAQ ACCORDION ========== */
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach((i) => {
        i.classList.remove('open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ========== TABS (visual only on public page) ========== */
  document.querySelectorAll('.tasks-tabs .tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      tab.parentElement.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  document.querySelectorAll('.details-tabs .dtab').forEach((tab) => {
    tab.addEventListener('click', () => {
      tab.parentElement.querySelectorAll('.dtab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  document.querySelectorAll('.calendar-filters .filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.parentElement.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  /* ========== PROGRESS BAR ANIMATION ON VIEW ========== */
  if (!prefersReducedMotion) {
    const bars = document.querySelectorAll('.progress-fill');
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const width = el.style.width;
            el.style.width = '0%';
            requestAnimationFrame(() => {
              el.style.transition = 'width 1s ease';
              el.style.width = width;
            });
            barObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );
    bars.forEach((bar) => barObserver.observe(bar));
  }
})();