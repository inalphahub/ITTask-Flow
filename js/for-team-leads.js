/* ============================================
   Task Flow — For Team Leads
   Interactions & Animations
   ============================================ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Navbar scroll effect ---------- */
  const navbar = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* ---------- Mobile hamburger menu ---------- */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');

  mobileMenuBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('mobile-open');
    mobileMenuBtn.classList.toggle('open', isOpen);
    mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.querySelectorAll('.dropdown-toggle').forEach((toggle) => {
    toggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const dropdown = toggle.closest('.dropdown');
      const isOpen = dropdown.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));

      navMenu.querySelectorAll('.dropdown').forEach((item) => {
        if (item !== dropdown) {
          item.classList.remove('open');
          item.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
        }
      });
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.dropdown')) {
      navMenu.querySelectorAll('.dropdown').forEach((dropdown) => {
        dropdown.classList.remove('open');
        dropdown.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
      });
    }
  });

  navMenu.querySelectorAll('a').forEach((el) => {
    el.addEventListener('click', () => {
      navMenu.classList.remove('mobile-open');
      mobileMenuBtn.classList.remove('open');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Count-up animation ---------- */
  function animateCount(el, target, duration = 1200) {
    if (prefersReducedMotion) {
      el.textContent = target;
      return;
    }
    const start = performance.now();
    const isPercent = el.parentElement?.classList.contains('analytics-card') && target > 10;

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * target);
      el.textContent = isPercent ? value : value;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Progress bar animation ---------- */
  function animateBar(el) {
    const width = el.getAttribute('data-width') || '0';
    if (prefersReducedMotion) {
      el.style.width = width + '%';
      return;
    }
    requestAnimationFrame(() => {
      el.style.width = width + '%';
    });
  }

  /* ---------- Intersection Observer for reveals ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          /* Count-ups inside */
          entry.target.querySelectorAll('[data-count]').forEach((el) => {
            if (!el.dataset.animated) {
              el.dataset.animated = '1';
              animateCount(el, parseInt(el.getAttribute('data-count'), 10));
            }
          });

          /* Progress bars inside */
          entry.target.querySelectorAll('[data-width]').forEach((el) => {
            if (!el.dataset.animated) {
              el.dataset.animated = '1';
              animateBar(el);
            }
          });

          /* Chart bars */
          entry.target.querySelectorAll('.chart-bar').forEach((bar, i) => {
            setTimeout(() => bar.classList.add('visible'), prefersReducedMotion ? 0 : i * 80);
          });

          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  /* ---------- Hero dashboard special animation ---------- */
  function initHeroDashboard() {
    const card = document.getElementById('heroDashboard');
    if (!card) return;

    const stats = card.querySelectorAll('[data-count]');
    const progress = document.getElementById('heroProgress');
    const pctLabel = document.getElementById('heroPct');
    const alert = document.getElementById('heroAlert');

    // Stats count up after short delay
    setTimeout(() => {
      stats.forEach((el) => {
        animateCount(el, parseInt(el.getAttribute('data-count'), 10), 1400);
      });
    }, prefersReducedMotion ? 0 : 400);

    // Progress bar
    setTimeout(() => {
      if (progress) {
        animateBar(progress);
        if (pctLabel) {
          let start = 0;
          const target = 84;
          const duration = 1400;
          const t0 = performance.now();
          function tick(now) {
            const p = Math.min((now - t0) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            pctLabel.textContent = Math.round(eased * target) + '%';
            if (p < 1) requestAnimationFrame(tick);
          }
          if (!prefersReducedMotion) requestAnimationFrame(tick);
          else pctLabel.textContent = '84%';
        }
      }
    }, prefersReducedMotion ? 0 : 600);

    // Alert appears last
    setTimeout(() => {
      if (alert) alert.classList.add('visible');
    }, prefersReducedMotion ? 0 : 1600);
  }

  // Run hero animation after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroDashboard);
  } else {
    initHeroDashboard();
  }

  /* ---------- Assign Task demo interaction ---------- */
  const assignBtn = document.getElementById('assignBtn');
  const assignmentResult = document.getElementById('assignmentResult');

  if (assignBtn && assignmentResult) {
    let assigned = false;

    assignBtn.addEventListener('click', () => {
      if (assigned) return;
      assigned = true;
      assignBtn.textContent = 'Assigned ✓';
      assignBtn.style.background = '#10B981';
      assignBtn.disabled = true;

      const steps = assignmentResult.querySelectorAll('.flow-step');
      const arrows = assignmentResult.querySelectorAll('.flow-arrow');

      steps.forEach((step, i) => {
        setTimeout(() => {
          step.classList.add('visible');
          if (arrows[i]) {
            setTimeout(() => arrows[i].classList.add('visible'), 150);
          }
        }, prefersReducedMotion ? 0 : i * 400);
      });
    });
  }

  /* ---------- Milestones staggered reveal ---------- */
  const milestonesObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.milestone-item');
          items.forEach((item) => {
            const delay = parseInt(item.getAttribute('data-delay') || '0', 10);
            setTimeout(() => item.classList.add('visible'), prefersReducedMotion ? 0 : delay);
          });
          milestonesObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  const milestonesTimeline = document.getElementById('milestonesTimeline');
  if (milestonesTimeline) milestonesObserver.observe(milestonesTimeline);

  /* ---------- Workflow steps staggered reveal ---------- */
  function observeWorkflow(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const steps = entry.target.querySelectorAll('.wf-step');
            const connectors = entry.target.querySelectorAll('.wf-connector');

            steps.forEach((step) => {
              const delay = parseInt(step.getAttribute('data-delay') || '0', 10);
              setTimeout(() => step.classList.add('visible'), prefersReducedMotion ? 0 : delay);
            });

            connectors.forEach((c, i) => {
              setTimeout(() => c.classList.add('visible'), prefersReducedMotion ? 0 : (i + 1) * 80 + 40);
            });

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(container);
  }

  observeWorkflow('dailyWorkflow');
  observeWorkflow('lifecycleWorkflow');

  /* ---------- Distribution bars ---------- */
  const distObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.dist-bar').forEach((bar) => {
            if (!bar.dataset.animated) {
              bar.dataset.animated = '1';
              animateBar(bar);
            }
          });
          distObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll('.distribution-list').forEach((el) => distObserver.observe(el));

  /* ---------- Project progress bars ---------- */
  const projectObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.project-progress-fill').forEach((bar) => {
            if (!bar.dataset.animated) {
              bar.dataset.animated = '1';
              animateBar(bar);
            }
          });
          projectObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll('.projects-grid').forEach((el) => projectObserver.observe(el));

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach((openItem) => {
        openItem.classList.remove('open');
      });

      if (!wasOpen) {
        item.classList.add('open');
      }
    });
  });

  /* ---------- Calendar filter demo (visual only) ---------- */
  document.querySelectorAll('.cal-filter').forEach((filter) => {
    filter.addEventListener('click', () => {
      document.querySelectorAll('.cal-filter').forEach((f) => f.classList.remove('active'));
      filter.classList.add('active');
    });
  });

})();