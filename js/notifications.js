document.addEventListener('DOMContentLoaded', () => {
    // ===== Mobile Menu Toggle =====
    const hamburger = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('navMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('mobile-open');
            hamburger.classList.toggle('open', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
        });

        // Close menu when a link is clicked
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                mobileMenu.classList.remove('mobile-open');
                hamburger.setAttribute('aria-expanded', 'false');
                document.querySelectorAll('.dropdown').forEach(dropdown => dropdown.classList.remove('open'));
            });
        });

    }

    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', event => {
            event.stopPropagation();
            const dropdown = toggle.closest('.dropdown');
            const isOpen = dropdown.classList.toggle('open');
            toggle.setAttribute('aria-expanded', isOpen);
            document.querySelectorAll('.dropdown').forEach(item => {
                if (item !== dropdown) {
                    item.classList.remove('open');
                    item.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
                }
            });
        });
    });

    document.addEventListener('click', event => {
        if (!event.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('open');
                dropdown.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
            });
        }
    });

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

    // ===== Navbar scroll shadow =====
    const navbar = document.querySelector('.site-header');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // ===== Category filter buttons (visual only) =====
    const catBtns = document.querySelectorAll('.cat-btn');
    catBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            catBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // ===== Preference toggles (visual feedback) =====
    document.querySelectorAll('.toggle input').forEach(input => {
        input.addEventListener('change', () => {
            // Visual only – no backend
            const row = input.closest('.pref-row');
            if (row) {
                row.style.transition = 'background 0.2s ease';
                row.style.background = input.checked ? 'rgba(79, 70, 229, 0.04)' : '';
                setTimeout(() => {
                    row.style.background = '';
                }, 400);
            }
        });
    });

    // ===== Scroll reveal animations =====
    const revealElements = document.querySelectorAll(
        '.info-card, .manage-item, .realtime-card, .benefit-card, .center-card, .detail-card, .prefs-list, .bell-demo, .notif-preview'
    );

    revealElements.forEach(el => {
        el.classList.add('fade-up');
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger slightly for nicer effect
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, (index % 4) * 60);
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        }
    );

    revealElements.forEach(el => observer.observe(el));

    // ===== Smooth scroll for in-page anchors =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
});