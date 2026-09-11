document.addEventListener('DOMContentLoaded', () => {
  // ===== Navbar scroll effect =====
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ===== Mobile menu =====
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  let overlay = document.querySelector('.menu-overlay');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
  }

  const closeMenu = () => {
    mobileToggle.classList.remove('active');
    navLinks.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    mobileToggle.classList.add('active');
    navLinks.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  mobileToggle.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeMenu();
    });
  });

  // ===== Workspace tabs =====
  const tabs = document.querySelectorAll('.ws-tab');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const content = document.getElementById(`${target}-tab`);
      if (content) content.classList.add('active');
    });
  });

  // ===== Project list interaction =====
  const projectItems = document.querySelectorAll('.project-item');
  projectItems.forEach(item => {
    item.addEventListener('click', () => {
      projectItems.forEach(p => p.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // ===== Scroll reveal animations =====
  const fadeUps = document.querySelectorAll('.fade-up');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeUps.forEach(el => observer.observe(el));

  // ===== Smooth active nav highlighting =====
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link:not(.cta-nav)');

  const highlightNav = () => {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navItems.forEach(link => {
          link.classList.remove('active-nav');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active-nav');
          }
        });
      }
    });
  };

  // Add active-nav style dynamically
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active-nav {
      color: var(--blue);
      background: rgba(37, 99, 235, 0.08);
    }
  `;
  document.head.appendChild(style);

  window.addEventListener('scroll', highlightNav, { passive: true });

  // ===== Task check interaction (demo) =====
  document.querySelectorAll('.task-check.empty').forEach(check => {
    check.addEventListener('click', function () {
      this.classList.remove('empty');
      this.innerHTML = '<i class="fas fa-check"></i>';
      const taskItem = this.closest('.task-item');
      if (taskItem) {
        const title = taskItem.querySelector('h5');
        if (title) {
          title.style.textDecoration = 'line-through';
          title.style.opacity = '0.6';
        }
      }
    });
  });

  // ===== Keyboard accessibility for mobile menu =====
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMenu();
    }
  });
});