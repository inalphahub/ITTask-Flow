/* ========================================
   Task Flow – Calendar Page Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ----- Navbar scroll effect -----
  const navbar = document.getElementById('siteHeader');
  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ----- Mobile menu -----
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navMenu');

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('mobile-open');
      mobileBtn.classList.toggle('open', isOpen);
      mobileBtn.setAttribute('aria-expanded', String(isOpen));
    });

    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
      dropdown.querySelector('.dropdown-toggle').addEventListener('click', event => {
        event.stopPropagation();
        const isOpen = dropdown.classList.contains('open');
        dropdowns.forEach(item => item.classList.remove('open'));
        if (!isOpen) dropdown.classList.add('open');
      });
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        mobileBtn.classList.remove('open');
        mobileBtn.setAttribute('aria-expanded', 'false');
        dropdowns.forEach(dropdown => dropdown.classList.remove('open'));
      });
    });

    document.addEventListener('click', event => {
      if (!event.target.closest('.dropdown')) {
        dropdowns.forEach(dropdown => dropdown.classList.remove('open'));
      }
    });
  }

  document.querySelectorAll('.login-btn').forEach(button => {
    button.addEventListener('click', () => {
      window.location.href = 'login.html';
    });
  });

  document.querySelectorAll('.get-started-btn').forEach(button => {
    button.addEventListener('click', () => {
      window.location.href = 'signup.html';
    });
  });

  // ----- Calendar view tabs -----
  const viewTabs = document.querySelectorAll('.view-tab');
  const viewPanels = document.querySelectorAll('.view-panel');

  viewTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.view;

      viewTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      viewPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `view-${target}`) {
          panel.classList.add('active');
        }
      });
    });
  });

  // ----- Scroll reveal animations -----
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: unobserve after reveal for performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  // ----- Smooth stagger for grid children -----
  document.querySelectorAll('.overview-grid, .deadline-grid, .events-grid, .reminders-grid, .benefits-grid').forEach(grid => {
    const children = grid.querySelectorAll('.animate-on-scroll');
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  // ----- Fake interactive filter tags (visual only) -----
  document.querySelectorAll('.filter-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
    });
  });

  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
    });
  });

  // ----- Subtle calendar nav buttons (demo) -----
  document.querySelectorAll('.cal-nav').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Visual feedback only
      btn.style.transform = 'scale(0.92)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 150);
    });
  });
});