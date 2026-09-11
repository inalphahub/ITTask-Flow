/* ============================================
   TaskFlow – Project Management Page JS
   Smooth animations, interactions, responsive
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Theme Toggle ----------
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || 'light';

  if (savedTheme === 'dark') {
    html.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  themeToggle?.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    if (isDark) {
      html.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  });

  // ---------- Navbar Scroll ----------
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ---------- Mobile Menu ----------
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  // Close menu on link click
  navMenu?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });

  // ---------- Smooth Reveal Animations ----------
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay));
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in, .fade-in-delay').forEach(el => {
    revealObserver.observe(el);
  });

  // ---------- Counter Animation ----------
  const animateCounter = (el, target, duration = 1800) => {
    const start = 0;
    const startTime = performance.now();
    const isPercent = el.textContent.includes('%') || el.dataset.count === '98';

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(start + (target - start) * ease);
      el.textContent = isPercent && target === 98 ? value : value.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target === 98 ? '98' : target.toLocaleString();
    };
    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  // ---------- Progress Circle ----------
  const progressCircle = document.querySelector('.progress-circle');
  if (progressCircle) {
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progress = parseInt(entry.target.dataset.progress) || 68;
          const circle = entry.target.querySelector('.progress');
          const circumference = 2 * Math.PI * 54; // r=54
          const offset = circumference - (progress / 100) * circumference;
          circle.style.strokeDasharray = circumference;
          circle.style.strokeDashoffset = offset;
          progressObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    progressObserver.observe(progressCircle);
  }

  // ---------- Timeline Progress ----------
  const timelineProgress = document.getElementById('timeline-progress');
  if (timelineProgress) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 2 of 5 steps completed + partial on 3rd ≈ 45%
          timelineProgress.style.width = '45%';
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    timelineObserver.observe(document.querySelector('.timeline'));
  }

  // ---------- Bar Chart Animation ----------
  const barFills = document.querySelectorAll('.bar-fill');
  if (barFills.length) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.bar-fill').forEach(bar => {
            const width = bar.dataset.width || 0;
            bar.style.width = width + '%';
          });
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    const barChart = document.querySelector('.bar-chart');
    if (barChart) barObserver.observe(barChart);
  }

  // ---------- Velocity Bars ----------
  const vBars = document.querySelectorAll('.v-bar');
  if (vBars.length) {
    const velObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.v-bar').forEach(bar => {
            const h = bar.dataset.height || 0;
            bar.style.height = h + '%';
          });
          velObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    const velChart = document.querySelector('.velocity-bars');
    if (velChart) velObserver.observe(velChart);
  }

  // ---------- Project Form ----------
  const projectForm = document.getElementById('project-form');
  const formSuccess = document.getElementById('form-success');
  const createAnother = document.getElementById('create-another');

  // Set default dates
  const startDate = document.getElementById('start-date');
  const endDate = document.getElementById('end-date');
  if (startDate && endDate) {
    const today = new Date();
    const end = new Date();
    end.setDate(today.getDate() + 45);
    startDate.valueAsDate = today;
    endDate.valueAsDate = end;
  }

  projectForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simple validation
    const name = document.getElementById('project-name').value.trim();
    const manager = document.getElementById('project-manager').value;
    if (!name || !manager) return;

    // Animate out form, show success
    projectForm.style.transition = 'opacity 0.3s, transform 0.3s';
    projectForm.style.opacity = '0';
    projectForm.style.transform = 'translateY(20px)';

    setTimeout(() => {
      projectForm.hidden = true;
      formSuccess.hidden = false;
      formSuccess.style.opacity = '0';
      formSuccess.style.transform = 'translateY(20px)';
      requestAnimationFrame(() => {
        formSuccess.style.transition = 'opacity 0.4s, transform 0.4s';
        formSuccess.style.opacity = '1';
        formSuccess.style.transform = 'translateY(0)';
      });
    }, 300);
  });

  createAnother?.addEventListener('click', () => {
    formSuccess.style.opacity = '0';
    formSuccess.style.transform = 'translateY(20px)';
    setTimeout(() => {
      formSuccess.hidden = true;
      projectForm.hidden = false;
      projectForm.reset();
      if (startDate && endDate) {
        const today = new Date();
        const end = new Date();
        end.setDate(today.getDate() + 45);
        startDate.valueAsDate = today;
        endDate.valueAsDate = end;
      }
      projectForm.style.opacity = '0';
      projectForm.style.transform = 'translateY(20px)';
      requestAnimationFrame(() => {
        projectForm.style.opacity = '1';
        projectForm.style.transform = 'translateY(0)';
      });
    }, 300);
  });

  // ---------- Milestone Modal ----------
  const modal = document.getElementById('milestone-modal');
  const addMilestoneBtn = document.getElementById('add-milestone-btn');
  const modalClose = document.getElementById('modal-close');
  const modalCancel = document.getElementById('modal-cancel');
  const milestoneForm = document.getElementById('milestone-form');

  const openModal = () => {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.hidden = true;
    document.body.style.overflow = '';
  };

  addMilestoneBtn?.addEventListener('click', openModal);
  modalClose?.addEventListener('click', closeModal);
  modalCancel?.addEventListener('click', closeModal);

  modal?.querySelector('.modal-backdrop')?.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  milestoneForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('ms-name').value.trim();
    if (!name) return;

    // Visual feedback
    const btn = milestoneForm.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Created!';
    btn.disabled = true;

    setTimeout(() => {
      closeModal();
      milestoneForm.reset();
      btn.innerHTML = original;
      btn.disabled = false;

      // Optional: toast-like feedback
      showToast('Milestone created successfully');
    }, 800);
  });

  // ---------- Toast Helper ----------
  function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '28px',
      right: '28px',
      background: 'var(--bg-card)',
      color: 'var(--text-primary)',
      padding: '14px 22px',
      borderRadius: '12px',
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      zIndex: '3000',
      fontWeight: '500',
      fontSize: '0.95rem',
      transform: 'translateY(20px)',
      opacity: '0',
      transition: 'all 0.3s ease'
    });
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ---------- Active Nav Link on Scroll ----------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}` || 
              (id === 'hero' && link.getAttribute('href') === 'project-management.html')) {
            // keep Projects active when on page
          }
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.25, rootMargin: '-80px 0px -40% 0px' });

  sections.forEach(sec => sectionObserver.observe(sec));

  // Keep "Projects" highlighted as current page
  const projectsLink = document.querySelector('.nav-link[href="project-management.html"]');
  if (projectsLink) projectsLink.classList.add('active');
});